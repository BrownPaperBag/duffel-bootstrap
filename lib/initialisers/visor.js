var visor = require('visor');

module.exports = function(app, rootDirectory, callback) {
  app.set('visor', visor.initialise(app, rootDirectory, function() {
    callback(null, app, rootDirectory);
  }));
};
