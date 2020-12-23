module.exports = function (app) {
  const cripto = require('../controllers/cripto.controller');

  app.get('/cripto', cripto.getAll);
  app.get('/cripto/top', cripto.getTop);
  app.post('/cripto', cripto.addCripto);
};