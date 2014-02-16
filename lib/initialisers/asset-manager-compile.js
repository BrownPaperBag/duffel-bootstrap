var path = require('path');

module.exports = function(app, rootDirectory, callback) {
  app.get('assetManager').compile(rootDirectory, callback);
};
