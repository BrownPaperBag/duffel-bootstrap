var express = require('express'),
  path = require('path'),
  poweredBy = require('connect-powered-by'),
  fs = require('fs'),
  async = require('async');

module.exports = function finalApplicationSetup(app, callback) {

  app.use(poweredBy('duffel')).as('poweredBy');
  app.use(express.static(path.join(app.get('rootDirectory'), '/public'))).as('static-public');

  app.use(function(req, res, next){
    next();
  }).as('final');

  // Update database if required
  app.get('database').connections.main.isActual(function(error, actual) {
    if (error || !actual) {
      app.get('database').connections.main.autoupdate(function(error) {
        if (error) throw error;
      });
    }
  });

  var errorTemplates = {
    401: '/errors/401.nunjucks',
    403: '/errors/403.nunjucks',
    404: '/errors/404.nunjucks',
    500: '/errors/500.nunjucks'
  };

  async.each(Object.keys(errorTemplates), function(errorCode, eachCallback) {
    var templatePath = errorTemplates[errorCode];
    fs.exists(app.get('rootDirectory') + '/views' + templatePath, function(exists) {
      if (!exists) {
        errorTemplates[errorCode] = '/duffel-bootstrap/errors/generic.nunjucks';
      }
      eachCallback();
    });
  }, function(error) {

    app.use(function(req, res, next) {
      res.status(404);
      if (req.accepts('html')) {
          return res.render(errorTemplates[404], {
            error: { status: 404, message: 'Page not found', toString: function() { return '404 page not found'; } },
            user: req.user
          });
      }

      if (req.accepts('json')) {
        return res.send({
          error: 'Not found'
        });
      }
      res.type('txt').send('Not found');
    }).as('error404');

    // Handle 500's and other errors
    app.use(function(error, req, res, next) {
      if (!error.status) {
        error.status = 500;
      }

      res.status(error.status);
      if (req.accepts('html')) {
          return res.render(errorTemplates[error.status], {
            error: error,
            user: req.user
          });
      }
      if (req.accepts('json')) {
        return res.send({
          error: error.message
        });
      }
      res.type('txt').send(error.message);
    }).as('error');


    callback(null, app);
  });

};
