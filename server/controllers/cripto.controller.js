const db = require('../config/db.config');
const users = require('../controllers/users.controller');
const jwt = require('../controllers/jwt.controller');

exports.getAll = async (req, res) => {
  let coins = '';
  let user = {};

  if (req.query && req.query.user_id) {
    user = await users.getUser(req.query.user_id);

    user = user[0].dataValues;
  }

  coins = await db.coinGecko.coins.markets({
    vs_currency: (user && user.default_cripto != null) ? user.default_cripto : 'usd',
    per_page: 100,
    page: req.query.page || 1
  });

  coins = coins.data.map(x => {
    let obj = {
      symbol: x.symbol,
      name: x.name,
      price: x.current_price,
      image: x.image,
      last_updated: x.last_updated
    };
    return obj;
  });

  res.status(200).send(coins);
}

exports.addCripto = async (req, res) => {
  if (req.body && req.body.user_id && req.body.symbol && req.body.name && req.body.price && req.body.image && req.body.last_updated) {
    user = await users.getUser(req.body.user_id);
    user = user[0].dataValues;

    var myJwt = jwt.getJwt();
    var token = (Object.keys(myJwt).length > 0) ? jwt.jwtModule(myJwt.key).decode(myJwt.token) : undefined;

    if (user && user.user_id && token && token.user_id == user.user_id) {
      db.currency.create({
        user_id: user.user_id,
        symbol: req.body.symbol,
        price: req.body.price,
        name: req.body.name,
        image: req.body.image,
        last_update: req.body.last_updated,
      }).then(() => {
        res.status(201).send({
          ok: true,
          msg: 'Cripto Currency added successfully.'
        });
      }).catch(err => {
        res.status(409).send(err);
      });
    } else {
      res.status(401).send('User Id not found');
    }
  } else {
    res.status(401).send('Missing variables');
  }
}

exports.getTop = async (req, res) => {
  var size = (req.query.size && req.query.size <= 25) ? req.query.size : 25;
  var order = (req.query.order && req.query.order == 'asc') ? req.query.order : 'desc';

  if (req.query.user_id) {
    user = await users.getUser(req.query.user_id);
    user = user[0].dataValues;

    var myJwt = jwt.getJwt();
    var token = (Object.keys(myJwt).length > 0) ? jwt.jwtModule(myJwt.key).decode(myJwt.token) : undefined;

    if (user && user.user_id && token && token.user_id == user.user_id) {
      db.currency.findAll({
        where: {
          user_id: req.query.user_id,
        },
        order: [
          ['price', order]
        ],
        limit: Number(size)
      }).then(async response => {
        var arrCoins = Array();
        for (const e of response) {
          coin = await db.coinGecko.coins.fetch(e.cripto_id, {});
          if (coin && coin.code == 200) {
            var x = coin.data;
            coin = {
              symbol: x.symbol,
              name: x.name,
              ars_price: x.market_data.current_price.ars,
              usd_price: x.market_data.current_price.usd,
              eur_price: x.market_data.current_price.eur,
              image: x.image.large,
              last_updated: x.last_updated
            };
            arrCoins.push(coin);
          }
        }
        if (arrCoins.length > 0) {
          res.status(200).json(arrCoins);
        } else {
          res.status(200).json({
            msg: 'Price comparison data could not be retrieved, user criptocurrency data retrieved instead',
            data: response
          });
        }
      });
    } else {
      res.status(401).send('User Id not found');
    }
  } else {
    res.status(401).send('Missing variables');
  }
}