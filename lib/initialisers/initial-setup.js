module.exports = function(app, callback) {

  app.use(function(req, res, next){
    next();
  }).as('initial');

  callback(null, app);
};
