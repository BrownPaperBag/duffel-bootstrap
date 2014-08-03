module.exports = function pagesInitialisation(app, callback) {
  require('duffel-pages').initialise(app, function(error) {
    callback(error, app);
  });
};
