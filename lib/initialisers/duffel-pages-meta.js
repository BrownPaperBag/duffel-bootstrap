module.exports = function pagesMetaInitialisation(app, callback) {
  require('duffel-pages-meta').initialise(app, function(error) {
    callback(error, app);
  });
};
