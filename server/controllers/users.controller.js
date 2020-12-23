const db = require('../config/db.config');
const jwt = require('../controllers/jwt.controller');
const op = db.Sequelize.Op;
const randomize = require('randomatic');

exports.login = (req, res) => {
  if (typeof req.body != 'undefined' && typeof req.body.username != 'undefined' && typeof req.body.password != 'undefined') {
    db.users.findOne({
      where: {
        [op.and]: {
          password: req.body.password,
          username: req.body.username
        },
      },
    }).then(usuario => {
      if (!usuario) {
        res.status(204).json(null);
      } else {
        let random = randomize('A0', 10);
        var store = jwt.jwtModule(random).encode(usuario);
        jwt.setJwt(random, store);

        res.status(200).send({
          ok: true,
          msg: 'Login Successful.'
        });
      }
    });
  } else {
    res.status(401).send('Missing variables');
  }
};

exports.getUsers = async (req, res) => {
  try {
    let data = await getUser(req.query.user_id);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).json({
      error: error
    });
  }
};

var getUser = exports.getUser = async (user_id) => {
  let response = {};
  if (user_id) {
    response = await db.users.findAll({
      where: {
        user_id: user_id
      }
    }).then(result => {
      return result;
    });
  } else {
    response = await db.users.findAll({}).then(result => {
      return result;
    });
  }

  return response;
}

exports.createUser = (req, res) => {
  if (req.body && req.body.username && req.body.password) {
    db.users.create({
      username: req.body.username,
      password: req.body.password,
    }).then(() => {
      res.status(201).send({
        ok: true,
        msg: 'User created successfully.'
      });
    }).catch(err => {
      res.status(409).send(err);
    });
  } else {
    res.status(401).send('Missing variables');
  }
};

exports.deleteUser = (req, res) => {
  db.users.destroy({
    where: {
      user_id: req.params.id,
    }
  }).then(() => {
    res.status(202).json({
      ok: true,
      mensaje: `User with id ${req.params.id} was eliminated`,
    });
  }).catch(err => {
    res.status(409).send(err);
  });
};

exports.modifyUser = (req, res) => {
  if (req.body && req.params.id) {
    db.users.update(req.body, {
      where: {
        user_id: req.params.id,
      },
    }).then(() => {
      res.status(202).json({
        ok: true,
        mensaje: `User with id ${req.params.id} was modified`,
      });
    }).catch(err => {
      res.status(409).send(err);
    });
  } else {
    res.status(401).send('Missing variables');
  }
};