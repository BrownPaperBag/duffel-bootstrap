var assetManager = require('duffel-asset-manager');

module.exports = function assetManagerInitialise(app, callback) {
  assetManager.initialise(app);
  callback(null, app);
};
