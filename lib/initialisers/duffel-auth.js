var auth = require('duffel-auth');

module.exports = function(app, callback) {
  auth.initialise(app, app.get('database'), function(error) {
    callback(error, app);
  });
};

