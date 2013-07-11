var nunjucks = require('nunjucks'),
  path = require('path'),
  nunjucksAppend = require('nunjucks-append');

module.exports = function(rootDirectory, app, callback) {
  app.set('views', path.resolve(rootDirectory, '/../views'));
  app.set('view engine', 'nunjucks');

  var views = new nunjucks.FileSystemLoader(path.resolve(path.join(rootDirectory, 'views')));
  var nunjucksEnvironment = new nunjucks.Environment(views, {
    tags: {
      blockStart: '{%',
      blockEnd: '%}',
      variableStart: '{$',
      variableEnd: '$}',
      commentStart: '{#',
      commentEnd: '#}'
    }
  });
  nunjucksEnvironment.express(app);
  app.set('nunjucksEnvironment', nunjucksEnvironment);
  nunjucksAppend.initialise(nunjucksEnvironment);

  callback();
}
