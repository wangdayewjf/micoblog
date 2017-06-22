var settings = require('../settings');
var MongoClient = require('mongodb').MongoClient;//,据说它是自动维护连接池的。
 var Server = require('mongodb').Server;
module.exports = new MongoClient(new Server(settings.host,27017, {}));
//module.exports=MongoClient;