var mongoose = require('mongoose');

module.exports = function(app, local, callback) {
  mongoose.set('debug', local.mongoose.debug);
  mongoose.connect(local.mongo.uri, local.mongo.options);
  mongoose.connection.on('error', function(error) {
    callback(error);
  });
  mongoose.connection.on('open', function() {
    callback();
  });
}
