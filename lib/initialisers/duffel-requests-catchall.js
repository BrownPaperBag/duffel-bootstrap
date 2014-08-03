module.exports = function requestsCatchallInitialisation(app, callback) {
  require('duffel-requests').catchall(app, function(error) {
    callback(null, app);
  });
};

