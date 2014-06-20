var express = require('express'),
  errorHandler = require('express-error-handler'),
  path = require('path'),
  poweredBy = require('connect-powered-by');

module.exports = function finalApplicationSetup(app, callback) {

  app.use(poweredBy('duffel')).as('poweredBy');
  app.use(express.static(path.join(app.get('rootDirectory'), '/public'))).as('static-public');

  app.use(function(req, res, next){
    next();
  }).as('final');

  // Handle 404's
  app.use(function error404(req, res) {
    res.status(404);
    if (req.accepts('html')) {
      return res.render('errors/404.nunjucks');
    }
    if (req.accepts('json')) {
      return res.send({
        error: 'Not found'
      });
    }
    res.type('txt').send('Not found');
  }).as('error404');

  app.after('final').use(errorHandler({
    handlers: {
      '200': function(error, req, res, next) {
        if (error) {
          console.error(error.message);
          console.error(error.stack);
        }
        next();
      },

      '401': function(error, req, res, next) {
        res.status(401);
        res.render('/errors/401.nunjucks');
      },

      '403': function(error, req, res, next) {
        console.log(error);
        res.status(403);
        res.render('/errors/403.nunjucks', {
          error: error,
          user: req.user
        });
      },

      '404': function(error, req, res, next) {
        res.status(404);
        res.render('/errors/404.nunjucks', {
          error: error,
          user: req.user
        });
      },

      '500': function(error, req, res, next) {
        res.status(500);
        res.render('/errors/500.nunjucks', {
          error: error,
          user: req.user
        });
      }
    },
    views: {
      default: '/errors/500.nunjucks'
    }

  })).as('error-handler');

  // Update database if required
  app.get('database').connections.main.isActual(function(error, actual) {
    if (error || !actual) {
      app.get('database').connections.main.autoupdate(function(error) {
        if (error) throw error;
      });
    }
  });

  callback(null, app);
};
