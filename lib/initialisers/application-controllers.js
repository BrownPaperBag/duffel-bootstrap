var controllerLoader = require('controller-loader'),
  path = require('path');

module.exports = function loadApplicationControllers(app, callback) {

  controllerLoader.load(path.resolve(path.join(app.get('rootDirectory'), 'controllers')), function(controller) {
    require(controller)({
      app: app,
      local: local
    });
  }, function(error) {
    callback(error, app);
  });

};
