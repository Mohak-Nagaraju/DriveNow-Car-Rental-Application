// require route files and export the constructor method.

const routes = require('./routesAPI');

const constructorMethod = (app) => {
  app.use('/', routes); 

  app.use('*', (req, res) => {
    res.status(404).json({error: "Page Not Found"});
  });
};

module.exports = constructorMethod;