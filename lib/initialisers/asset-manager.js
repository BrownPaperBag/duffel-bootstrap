var assetManager = require('duffel-asset-manager');

module.exports = function(app, callback) {
  assetManager.initialise(app);
  callback(null, app);
};
