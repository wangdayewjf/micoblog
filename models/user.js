var mongodb = require("./db");

function User(user){
	this.name = user.name;
	this.password = user.password;
}




User.prototype.save = function(callback){
	var user = {
		username :this.name,
		password : this.password,
	}
	mongodb.open( function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("users",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.ensureIndex("name",{unique:true});
			collection.insert(user,{safe:true},function(err,user){
				mongodb.close();
				callback(err,user);//问，好像回调即便什么参数都没也可以从有个参数数组里面获取参数的。
			});
		});
	});
}

User.get = function(username,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("users",function(err,collection){
			if(err){
				mongodb.close();//问：为什么是关mongodb不是关闭db?
				return callback(err);
			}
			collection.findOne({name:username},function(err,doc){
				mongodb.close();
				if(doc){
					var user = new User(doc);//问：获取的是不是json对象，而不是user对象，这里将json对象转化成user对象？
					callback(err,user);
				}else{
					callback(null);
				}
			});
		});
	});
}
module.exports = User;