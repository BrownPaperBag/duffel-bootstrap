module.exports = function(app, callback) {
  require('duffel-requests').catchall(app, function(error) {
    callback(null, app);
  });
};

