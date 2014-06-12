var path = require('path'),
  fs = require('fs'),
  async = require('async');

module.exports = function loadApplictionSpecifiedInitialisers(app, rootDirectory, callback) {

  var initialisersDirectory = path.join(rootDirectory, 'initialisers');
  fs.readdir(initialisersDirectory, function(error, files) {
    if (error) {
      return callback(error);
    }

    async.eachSeries(files, function(initialiserFile, eachSeriesCallback) {
      if (initialiserFile.search(new RegExp(/^\./)) !== -1) {
        return eachSeriesCallback();
      }
      var initialiser = path.join(initialisersDirectory, initialiserFile);
      require(initialiser)(rootDirectory, app, local, eachSeriesCallback);
    }, function(error) {
      return callback(error, app, rootDirectory);
    });
  });
};
