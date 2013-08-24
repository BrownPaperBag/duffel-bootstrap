var visor = require('duffel-visor');

module.exports = function(app, rootDirectory, callback) {
  visor.initialise(app);
  callback(null, app, rootDirectory);
};
