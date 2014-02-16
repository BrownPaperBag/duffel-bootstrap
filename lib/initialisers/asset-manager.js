var assetManager = require('duffel-asset-manager');

module.exports = function(app, rootDirectory, callback) {
  assetManager.initialise(app);
  callback(null, app, rootDirectory);
};
