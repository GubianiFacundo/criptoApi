const Sequelize = require('sequelize');
const cfg = require('../config/config.json');
const CoinGecko = require('coingecko-api');
const mariadb = require('mariadb/callback');

function initialize() {
  const { HOST, PORT, USER, PASS, DB } = cfg.db;
  const connection = mariadb.createConnection({ host: HOST, user: USER, password: PASS, port: PORT });
  connection.connect(err => {
    if (err) {
      console.log("not connected due to error: " + err);
    } else {
      console.log("connected ! connection id is " + connection.threadId);
      connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB}\`;`);

      db.sequelize.sync().then(() => {
        db.users.findOne({
          where: {
            username: 'admin',
          },
        }).then(usu => {
          if (usu == null) {
            db.users.create({
              username: 'admin',
              password: 'admin',
            });
          }
        });
      
        console.log('Se crearon las tablas');
      });
    }
  });
}

var sequelize = new Sequelize(cfg.db.DB, cfg.db.USER, cfg.db.PASS, {
	dialect: cfg.dialect,
	host: cfg.db.HOST,
  timezone: 'America/Argentina/Buenos_Aires',
  useUTC: false,
});

const CoinGeckoClient  = new CoinGecko();

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.coinGecko = CoinGeckoClient;
db.initialize = initialize();

require('../models/@association')(db, sequelize, Sequelize);

module.exports = db;