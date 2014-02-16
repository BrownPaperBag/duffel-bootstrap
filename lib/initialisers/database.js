var path = require('path'),
  fs = require('fs');

module.exports = function(app, rootDirectory, callback) {
  var databaseConfigFile = path.resolve(rootDirectory, 'config/database.js');
  fs.exists(databaseConfigFile, function(exists) {
    if (!exists) {
      return callback(new Error('Database config file is required - ' + databaseConfigFile + ' does not exist'));
    }
    app.database = require(databaseConfigFile);
    callback(null, app, rootDirectory);
  });
};
