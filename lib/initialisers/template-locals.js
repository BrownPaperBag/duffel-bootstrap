var path = require('path');

module.exports = function(app, callback) {
  var templateLocalsConfig = require(path.resolve(app.get('rootDirectory'), 'config/template-locals.js'));
  app.before('router').use(function environmentLocals(req, res, next) {
    res.locals.environment = templateLocalsConfig[local.environment];
    next();
  }).as('environmentLocals');
  callback(null, app);
};
