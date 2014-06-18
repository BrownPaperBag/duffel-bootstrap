module.exports = function(app, callback) {
  require('duffel-requests').initialise(app, app.database.mongoose, app.database.common(), function() {
    callback(null, app);
  });
};
