var async = require('async'),
  express = require('express'),
  fs = require('fs');

module.exports = {
  run: function(rootDirectory, applicationCallback) {
    var app = require('connectr').patch(express());

    async.waterfall([
      function checkRootDirectory(callback) {
        if (typeof rootDirectory !== 'string') {
          throw new Error('Root directory is required - ' + rootDirectory + ' is not a string');
        }

        fs.exists(rootDirectory, function(exists) {
          if (!exists) {
            return callback(new Error('Root directory is required - ' + rootDirectory + ' does not exists'));
          }
          return callback(null, app, rootDirectory);
        });
      },
      require('./lib/initialisers/database'),
      require('./lib/initialisers/asset-manager'),
      require('./lib/initialisers/local'),
      require('./lib/initialisers/nunjucks'),
      require('./lib/initialisers/template-locals'),
      require('./lib/initialisers/application'),
      require('./lib/initialisers/initialisers'),
      require('./lib/initialisers/intermediate-middleware'),
      require('./lib/initialisers/asset-manager-compile'),
      require('./lib/initialisers/application-controllers'),
      require('./lib/initialisers/final-setup')
    ], function(error) {
      applicationCallback(error, app);
    });
  }
};
