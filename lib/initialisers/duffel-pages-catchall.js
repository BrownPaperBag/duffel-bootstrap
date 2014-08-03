module.exports = function pagesCatchallInitialisation(app, callback) {
  require('duffel-pages').catchall(app, function(error) {
    callback(error, app);
  });
};
