const ipRoutes = require('./ip');

const constructorMethod = (app) => {
  app.use('/', ipRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;