var path = require('path'),
  fs = require('fs'),
  async = require('async');

module.exports = function loadApplictionSpecifiedInitialisers(app, rootDirectory, callback) {

  var initialisersDirectory = path.join(rootDirectory, 'initialisers');
  fs.readdir(initialisersDirectory, function(err, files) {
    if (err) return callback(err);
    return async.eachSeries(files, function(initialiserFile, eachSeriesCallback) {
      if (err) return eachSeriesCallback(err);
      if (initialiserFile.search(new RegExp(/^\./)) !== -1) {
        return eachSeriesCallback();
      }
      var initialiser = path.join(initialisersDirectory, initialiserFile);
      return require(initialiser)(rootDirectory, app, local, eachSeriesCallback);
    }, function(error) {
      return callback(error, app, rootDirectory);
    });
  });
};
