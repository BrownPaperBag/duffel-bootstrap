module.exports = function requestsInitialisation(app, callback) {
  require('duffel-requests').initialise(app, function(error) {
    callback(error, app);
  });
};
