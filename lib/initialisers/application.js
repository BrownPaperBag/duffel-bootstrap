var express = require('express'),
  flash = require('connect-flash'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  csurf = require('csurf'),
  morgan = require('morgan'),
  MongoStore = require('connect-mongo')(session);

module.exports = function applicationSetup(app, rootDirectory, callback) {
  app.use(bodyParser()).as('bodyParser');
  app.use(methodOverride()).as('methodOverride');

  app.use(cookieParser(local.cookie.secret)).as('cookieParser');
  app.use(session({
    secret: local.session.secret,
    store: new MongoStore({
      db: app.database.common().db
    })
  })).as('session');

  app.use(csurf({
    value: function(req) {
      return (req.body && req.body._csrf) || (req.query && req.query._csrf) || (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']);
    }
  })).as('csrf-token');

  app.after('csrf-token').use(function xsrfToken(req, res, next) {
    //req.csrfToken(function(error, token) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
    //});
  }).as('xsrf-token');

  app.use(flash()).as('flash');
  app.use(morgan('dev')).as('logger');

  callback(null, app, rootDirectory);
};

