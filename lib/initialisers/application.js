var express = require('express'),
  flash = require('connect-flash'),
  MongoStore = require('connect-mongo')(express);

module.exports = function applicationSetup(app, rootDirectory, callback) {
  app.use(express.bodyParser()).as('bodyParser');
  app.use(express.methodOverride()).as('methodOverride');

  app.use(express.cookieParser(local.cookie.secret)).as('cookieParser');
  app.use(express.session({
    secret: local.session.secret,
    store: new MongoStore({
      db: app.database.common().db
    })
  })).as('session');
  app.use(express.csrf({
    value: function(req) {
      var token = (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']);
      return token;
    }
  })).as('csrf-token');

  app.use(function xsrfToken(req, res, next) {
    req.csrfToken(function(error, token) {
      res.cookie('XSRF-TOKEN', token);
      next(error);
    });
  }).as('xsrf-token');

  app.use(flash()).as('flash');
  app.use(express.logger('dev')).as('logger');
  app.use(app.router).as('router');

  callback(null, app, rootDirectory);
};

