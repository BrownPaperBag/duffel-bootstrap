var express = require('express'),
  flash = require('connect-flash'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override'),
  csrf = require('csurf'),
  morgan = require('morgan'),
  JugglingStore = require('connect-loopback-datasource-juggler')(session);

module.exports = function applicationSetup(app, callback) {
  app.use(bodyParser.urlencoded({
    extended: true
  })).as('bodyParser.urlencoded');
  app.use(bodyParser.json()).as('bodyParser');

  app.after('bodyParser').use(methodOverride()).as('methodOverride');

  app.after('bodyParser').use(cookieParser()).as('cookieParser');
  app.after('cookieParser').use(session({
    secret: local.session.secret,
    store: new JugglingStore(app.get('database').connections.main, {
      table: 'sessions',
      maxAge: 1000 * 60 * 60 * 24 * 14
    }),
    resave: true,
    saveUninitialized: true
  })).as('session');

  app.use(csrf({
    value: function(req) {
      return(req.body && req.csrfToken()) ||
        (req.query && req.query._csrf) ||
        (req.headers['x-csrf-token']) || (req.headers['x-xsrf-token']);
    }
  })).as('csrf-token').after('methodOverride');
  app.after('csrf-token').use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  }).as('xsrf-token');

  app.use(flash()).as('flash');

  callback(null, app);
};

