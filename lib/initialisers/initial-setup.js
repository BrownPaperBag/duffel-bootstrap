module.exports = function initialSetup(app, callback) {

  app.use(function(req, res, next){
    next();
  }).as('initial');

  callback(null, app);
};
