module.exports = function(app, callback) {
  require('duffel-pages').initialise(app, app.database.mongoose, app.database.common(), function() {
    callback(null, app);
  });
};
