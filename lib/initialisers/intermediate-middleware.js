var express = require('express'),
  path = require('path');

/**
 * Load middleware that needs to run after module initialisers but before controllers.
 *
 * @param {Function} callback
 * @return
 */
module.exports = function loadIntermediateMiddleware(app, rootDirectory, callback) {
  app.before('router').use(function applicationLocals(req, res, next) {
    res.locals.user = req.user;
    res.locals._csrf = req.session._csrf;
    res.locals.flash = req.flash();
    res.locals.now = new Date();
    next();
  }).as('applicationLocals');

  callback(null, app, rootDirectory);
};
