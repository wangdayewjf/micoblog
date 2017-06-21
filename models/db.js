var settings = require('../settings');
var Db = require('mongodb').Db;
//var MongoClient = require('mongodb').MongoClient;,据说它是自动维护连接池的。
 var Connection = require('mongodb').Connection;
 var Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host,27017, {}));
//module.exports=MongoClient;