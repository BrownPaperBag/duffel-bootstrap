var express = require('express'),
  path = require('path'),
  poweredBy = require('connect-powered-by');

module.exports = function finalApplicationSetup(app, rootDirectory, callback) {

  app.use(poweredBy('duffel')).as('poweredBy');
  app.use(express.favicon()).as('favicon');
  app.use(express.static(path.join(rootDirectory, '/public'))).as('static-public');

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

  app.use(function errorHandler(error, req, res) {
    if (error.name == 403) {
      res.status(403);
      return res.render('errors/403.nunjucks');
    }
    res.status(500);
    res.render('errors/500.nunjucks');
    throw error;
  }).as('error');
  callback(null, app, rootDirectory);
};
