var express = require('express'),
  path = require('path');

module.exports = function(app, rootDirectory, callback) {
  var assetify = app.get('assetify');
  assetify.use(assetify.plugins.bundle);
  assetify.compile({
    assets: {
      serve: false,
      explicit: true,
      source: path.join(rootDirectory, 'public'),
      bin: path.join(rootDirectory, 'public')
    }
  }, function(error) {
    callback(error, app, rootDirectory);
  });
};
