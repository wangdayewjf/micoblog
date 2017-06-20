var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
module.exports =  new Db(settings.db, new Server(settings.host, Connection.DEFAULT_
PORT, {}));//问：为什么引入它就会报错呢？

就是创建db连接失败了。