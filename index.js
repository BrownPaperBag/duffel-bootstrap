var async = require('async'),
  express = require('express'),
  fs = require('fs'),
  Promise = require('bluebird');

module.exports = {
  run: function(rootDirectory, applicationCallback) {
    var app = require('connectr').patch(express());

    app.set('rootDirectory', rootDirectory);

    Promise.reduce([
      function checkRootDirectory(app, callback) {
        if (typeof rootDirectory !== 'string') {
          throw new Error('Root directory is required - ' + rootDirectory + ' is not a string');
        }

        fs.exists(rootDirectory, function(exists) {
          if (!exists) {
            return callback(new Error('Root directory is required - ' + rootDirectory + ' does not exists'));
          }
          return callback(null, app);
        });
      },
      './lib/initialisers/initial-setup',
      './lib/initialisers/database',
      './lib/initialisers/asset-manager',
      './lib/initialisers/local',
      './lib/initialisers/nunjucks',
      './lib/initialisers/template-locals',
      './lib/initialisers/application',
      './lib/initialisers/duffel-visor',
      './lib/initialisers/duffel-auth',
      './lib/initialisers/duffel-requests-catchall',
      './lib/initialisers/duffel-pages-catchall',
      './lib/initialisers/initialisers',
      './lib/initialisers/intermediate-middleware',
      './lib/initialisers/duffel-cms',
      './lib/initialisers/duffel-requests',
      './lib/initialisers/duffel-pages',
      './lib/initialisers/duffel-pages-meta',
      './lib/initialisers/asset-manager-compile',
      './lib/initialisers/application-controllers',
      './lib/initialisers/final-setup'
    ], function(total, bootstrapper, index) {
      return new Promise(function(resolve, reject) {

        if (typeof bootstrapper === 'string') {
          bootstrapper = require(bootstrapper);
        }

        var timerName = 'Duffel bootstrap ' + bootstrapper.name;
        console.time(timerName);
        bootstrapper(app, function(error) {
          if (error) return reject(error);
          console.timeEnd(timerName);
          resolve();
        });
      });
    }, 0).then(function(total) {
      console.log('Duffel bootstrap complete');
      applicationCallback(null, app);
    }).catch(function(error) {
      applicationCallback(error);
    });
  }
};
