var express = require('express'),
  path = require('path'),
  poweredBy = require('connect-powered-by');

module.exports = function finalApplicationSetup(app, rootDirectory, callback) {

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
    throw error;
  });
  callback(null, app, rootDirectory);
};
