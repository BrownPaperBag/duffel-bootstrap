var controllerLoader = require('controller-loader'),
  path = require('path');

module.exports = function loadApplicationControllers(app, rootDirectory, callback) {
  controllerLoader.load(path.resolve(path.join(rootDirectory, 'controllers')), function(controller) {
    require(controller)({
      app: app,
      local: local
    });
  });
  callback(null, app, rootDirectory);
};
