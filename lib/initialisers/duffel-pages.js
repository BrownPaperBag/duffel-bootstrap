module.exports = function(app, callback) {
  require('duffel-pages').initialise(app, function(error) {
    callback(error, app);
  });
};
