var path = require('path'),
  fs = require('fs');

module.exports = function loadLocalConfig(app, rootDirectory, callback) {
  var localFile = path.resolve(rootDirectory, 'config/local.js');
  fs.exists(localFile, function(exists) {
    if (!exists) {
      return callback(new Error('Local configuration file is required - ' + localFile + ' does not exist'));
    }
    local = require(localFile);

    app.set('localConfig', local);
    app.set('rootUrl', local.rootUrl);

    callback(null, app, rootDirectory);
  });
};
