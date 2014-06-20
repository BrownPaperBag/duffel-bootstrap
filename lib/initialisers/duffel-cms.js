module.exports = function(app, callback) {
  require('duffel-cms').initialise(app, app.get('database'), function() {
    require('duffel-cms-raptor-editor').initialise(app, function(error) {
      callback(error, app);
    });
  });
};
