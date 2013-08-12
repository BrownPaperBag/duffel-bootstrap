var express = require('express'),
  path = require('path');

module.exports = function(app, rootDirectory, callback) {
  var assetify = app.get('assetify');
  assetify.use(assetify.plugins.bundle);
  var bin = path.join(rootDirectory, 'public');
  assetify.compile({
    assets: {
      explicit: true,
      serve: false,
      source: path.join(rootDirectory, 'public'),
      bin: bin
    }
  }, function(error) {
    assetify(bin);
    app.before('router').use(assetify.middleware).as('assetify');
    callback(error, app, rootDirectory);
  });
};
