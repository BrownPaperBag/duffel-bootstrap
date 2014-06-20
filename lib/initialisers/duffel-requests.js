module.exports = function(app, callback) {
  require('duffel-requests').initialise(app, function(error) {
    callback(error, app);
  });
};
