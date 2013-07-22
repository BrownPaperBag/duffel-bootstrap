var express = require('express'),
  path = require('path'),
  fs = require('fs'),
  async = require('async'),
  controllerLoader = require('controller-loader'),
  mongoose = require('mongoose'),
  MongoStore = require('connect-mongo')(express),
  flash = require('connect-flash'),
  poweredBy = require('connect-powered-by');

module.exports = {
  run: function(rootDirectory, applicationCallback) {
    if (typeof rootDirectory != 'string') {
      throw new Error('Root directory is required - ' + rootDirectory + ' is not a string');
    }

    var local = null,
      app = null;

    async.waterfall([
      function checkRootDirectory(callback) {
        fs.exists(rootDirectory, function(exists) {
          if (!exists) {
            return callback(new Error('Root directory is required - ' + rootDirectory + ' does not exists'));
          }
          callback();
        });
      },
      function loadDatabase(callback) {
        var databaseConfigFile = path.resolve(rootDirectory, 'database.js');
        fs.exists(databaseConfigFile, function(exists) {
          if (!exists) {
            return callback(new Error('Database config file is required - ' + databaseConfigFile + ' does not exist'));
          }
          callback(null, require(databaseConfigFile));
        });
      },
      function loadLocalConfig(database, callback) {
        var localFile = path.resolve(rootDirectory, 'local.js');
        fs.exists(localFile, function(exists) {
          if (!exists) {
            return callback(new Error('Local configuration file is required - ' + localFile + ' does not exist'));
          }
          local = require(localFile);

          app = express();
          app.set('rootUrl', local.rootUrl);
          app.database = database;

          callback();
        });
      },
      function nunjucks(callback) {
        require('./lib/initialisers/nunjucks')(rootDirectory, app, callback);
      },
      function applicationSetup(callback) {
        app.use(express.bodyParser());
        app.use(express.methodOverride());

        app.use(express.cookieParser(local.cookie.secret));
        app.use(express.session({
          secret: local.session.secret,
          store: new MongoStore({
            db: app.database.common().db
          })
        }));
        app.use(express.csrf({
          value: function(req) {
            var token = (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']);
            return token;
          }
        }));

        app.use(function(req, res, next) {
          res.cookie('XSRF-TOKEN', req.session._csrf);
          next();
        });

        app.use(flash());
        app.use(express.logger('dev'));

        callback();
      },
      function loadApplictionSpecifiedInitialisers(callback) {
        var initialisersDirectory = path.join(rootDirectory, 'initialisers');
        fs.readdir(initialisersDirectory, function(err, files) {
          if (err) return callback(err);
          async.eachSeries(files, function runInitialiser(initialiserFile, eachSeriesCallback) {
            if (err) return eachSeriesCallback(err);
            if (initialiserFile.search(new RegExp(/^\./)) !== -1) {
              return eachSeriesCallback();
            }
            var initialiser = path.join(initialisersDirectory, initialiserFile);
            require(initialiser)(rootDirectory, app, local, eachSeriesCallback);
          }, function(err) {
            callback(err);
          });
        });
      },

      /**
       * Load middleware that needs to run after module initialisers but before controllers.
       *
       * @param {Function} callback
       * @return
       */
      function loadIntermediateMiddleware(callback) {
        app.use(function(req, res, next) {
          res.locals.user = req.user;
          res.locals._csrf = req.session._csrf;
          res.locals.flash = req.flash();
          res.locals.now = new Date();
          next();
        });
        callback();
      },
      function loadApplicationControllers(callback) {
        controllerLoader.load(path.resolve(path.join(rootDirectory, 'controllers')), function(controller) {
          require(controller)({
            app: app,
            local: local
          });
        });
        callback();
      },
      function finalApplicationSetup(callback) {

        app.use(poweredBy('duffel'));
        app.use(express.favicon());
        app.use(express.static(path.join(rootDirectory, '/public')));
        app.use(app.router);

        // Handle 404's
        app.use(function(req, res) {
          res.status(404);
          if (req.accepts('html')) {
            return res.render('errors/404.html');
          }
          if (req.accepts('json')) {
            return res.send({
              error: 'Not found'
            });
          }
          res.type('txt').send('Not found');
        });

        app.use(function(error, req, res, next) {
          if (error.name == 403) {
            res.status(403);
            return res.render('errors/403.html');
          }
          res.status(500);
          res.render('errors/500.html');
        });
        callback();
      },
    ], function(error) {
      applicationCallback(error, app, local);
    });
  }
}
