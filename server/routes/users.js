
module.exports = function (app) {
  const users = require('../controllers/users.controller');

  app.post('/login', users.login);
  app.get('/users', users.getUsers);
  app.delete('/users/:id', users.deleteUser);
  app.put('/users/:id', users.modifyUser);
  app.post('/users', users.createUser);
};