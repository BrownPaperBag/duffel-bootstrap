module.exports = function visorInitialisation(app, callback) {
  require('duffel-visor').initialise(app, function() {
    callback(null, app);
  });
};

