var express = require('express'),
  path = require('path'),
  assetify = require('assetify').instance();

/**
 * Load middleware that needs to run after module initialisers but before controllers.
 *
 * @param {Function} callback
 * @return
 */
module.exports = function loadIntermediateMiddleware(app, rootDirectory, callback) {
  assetify(app, express, path.join(rootDirectory, 'public', 'assetify'));
  app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals._csrf = req.session._csrf;
    res.locals.flash = req.flash();
    res.locals.now = new Date();
    next();
  });
  callback(null, app, rootDirectory);
};
