var path = require('path'),
  fs = require('fs'),
  DataSource = require('loopback-datasource-juggler').DataSource;

module.exports = function(app, callback) {
  var databaseConfigFile = path.resolve(app.get('rootDirectory'), 'config/database.js');

  fs.exists(databaseConfigFile, function(exists) {
    if (!exists) {
      return callback(new Error('Database config file is required - ' + databaseConfigFile + ' does not exist'));
    }
    app.set('database', {
      DataSource: DataSource,
      connections: {
        main: require(databaseConfigFile).database(DataSource)
      }
    });
    callback(null, app);
  });
};
