module.exports = function(app, callback) {
  require('duffel-visor').initialise(app, function() {
    callback(null, app);
  });
};

