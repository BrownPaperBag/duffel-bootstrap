var mongoose = require('mongoose'),
  express = require('express'),
  flash = require('connect-flash'),
  MongoStore = require('connect-mongo')(express);

module.exports = function applicationSetup(app, rootDirectory, callback) {
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

  callback(null, app, rootDirectory);
};

