var nunjucks = require('nunjucks'),
  path = require('path');

module.exports = function(app, callback) {

  var nunjucksEnvironment = nunjucks.configure(path.join(app.get('rootDirectory'), 'views'), {
    autoescape: false,
    express: app,
    tags: {
      blockStart: '{%',
      blockEnd: '%}',
      variableStart: '{$',
      variableEnd: '$}',
      commentStart: '{#',
      commentEnd: '#}'
    }
  });

  nunjucksEnvironment.loaders
    .push(new nunjucks.FileSystemLoader(path.join(__dirname, '/../views')));

  app.set('nunjucksEnvironment', nunjucksEnvironment);
  app.set('nunjucks', nunjucks);

  callback(null, app);
};
