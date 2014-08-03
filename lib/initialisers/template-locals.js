var path = require('path'),
  fs = require('fs');

module.exports = function integrateTemplateLocals(app, callback) {
  var templateLocalsConfigFilePath = path.resolve(app.get('rootDirectory'), 'config/template-locals.js');
  fs.exists(templateLocalsConfigFilePath, function (exists) {
    if (!exists) {
      return callback(null, app);
    }

    var templateLocalsConfig = require(templateLocalsConfigFilePath);
    app.before('router').use(function environmentLocals(req, res, next) {
      res.locals.environment = templateLocalsConfig[local.environment];
      next();
    }).as('environmentLocals');

    callback(null, app);
  });
};
