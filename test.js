var express = require('express');
var app = express();
console.log("testDemo started");

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');//问：这是不是记录日志的？
var url = 'mongodb://localhost:27017/microblog';


//插入文档
var insertDocument = (user,err,db,callback) => {

	
    if(err){
			return callback(err);
		}
	db.collection("users",function(err,collection){
		if(err){
			//mongodb.close();
			return callback(err);
		}
		collection.ensureIndex("name",{unique:true});
		collection.insert(user,{safe:true},function(err,user){
			//mongodb.close();
			callback(err,user);//问，好像回调即便什么参数都没也可以从有个参数数组里面获取参数的。
		});
	});

    //在test库下blog集合中 新增json文档
    /*db.collection('blog').insertOne({
        name:"xiaos",
        age:22
    }, (err, result) => {
        assert.equal(err,null);
        console.log('新增文档成功');
        callback();
    });*/
};

//插入操作
MongoClient.connect(url, (err,db) => {
   // assert.equal(null,err);
   var user = {
		name :"test",
		password : "test123",
	}
    insertDocument(user,err,db, ()=>{
        db.close();
    });
});

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});

module.exports = app;