'use strict';

module.exports = (db, sequelize, Sequelize) => {
	db.users = require('./users')(sequelize, Sequelize);
	db.currency = require('./currency')(sequelize, Sequelize);

  db.currency.hasOne(db.users, {
    foreignKey: 'user_id',
		targetKey: 'user_id',
		constraints: false,
  });

	return db;
};
