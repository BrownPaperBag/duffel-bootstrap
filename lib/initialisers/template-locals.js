module.exports = function(app, rootDirectory, callback) {
  var templateLocalsConfig = require(path.resolve(rootDirectory, 'config/template-locals.js'));
  app.before('router').use(function environmentLocals(req, res, next) {
    res.locals.environment = templateLocalsConfig[local.environment];
    next();
  }).as('environmentLocals');
  callback(null, app, rootDirectory);
};
