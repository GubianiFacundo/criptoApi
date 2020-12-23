var express = require('express');
var router = express.Router();

module.exports = function (cfg) {
  require('./users')(router);
  require('./cripto')(router);
  
	return router;
};
