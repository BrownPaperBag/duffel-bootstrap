var path = require('path'),
  fs = require('fs'),
  Schema = require('promised-jugglingdb').Schema;

module.exports = function(app, callback) {
  var databaseConfigFile = path.resolve(app.get('rootDirectory'), 'config/database.js');
  fs.exists(databaseConfigFile, function(exists) {
    if (!exists) {
      return callback(new Error('Database config file is required - ' + databaseConfigFile + ' does not exist'));
    }
    app.set('database', {
      Schema: Schema,
      connections: {
        main: require(databaseConfigFile).schema(Schema)
      }
    });
    callback(null, app);
  });
};
