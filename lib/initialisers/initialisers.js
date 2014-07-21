var path = require('path'),
  fs = require('fs'),
  async = require('async');

module.exports = function loadApplictionSpecifiedInitialisers(app, callback) {

  var initialisersDirectory = path.join(app.get('rootDirectory'), 'initialisers');
  fs.exists(initialisersDirectory, function(exists) {
    if (!exists) {
      return callback(null, app);
    }

    fs.readdir(initialisersDirectory, function(error, files) {
      if (error) {
        return callback(error);
      }

      async.eachSeries(files, function(initialiserFile, eachSeriesCallback) {
        if (initialiserFile.search(new RegExp(/^\./)) !== -1) {
          return eachSeriesCallback();
        }
        var initialiser = path.join(initialisersDirectory, initialiserFile);
        require(initialiser)(app.get('rootDirectory'), app, local, eachSeriesCallback);
      }, function(error) {
        return callback(error, app);
      });
    });
  });
};
