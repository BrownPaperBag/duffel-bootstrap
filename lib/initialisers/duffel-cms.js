module.exports = function(app, callback) {
  require('duffel-cms').initialise(app, app.database.mongoose, app.database.common(), function() {
    require('duffel-cms-raptor-editor').initialise(app, app.database.mongoose, app.database.common(), function(error) {
      callback(error, app);
    });
  });
};
