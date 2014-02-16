var nunjucks = require('nunjucks'),
  path = require('path');

module.exports = function(app, rootDirectory, callback) {

  var nunjucksEnvironment = nunjucks.configure(path.join(rootDirectory, 'views'), {
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

  app.set('nunjucksEnvironment', nunjucksEnvironment);

  callback(null, app, rootDirectory);
};
