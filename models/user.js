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
User.prototype.logIn = function(username,callback){
	//mongodb验证，获取到的数据存入locals.user中。还是那个方法，通过username来查询，只是对比多了password对比
	mongodb.open(function(err,db){
		if(err){
			mongodb.close();
			return callback.call(this,err);
		}
		db.collection("users",function(err,collection){
			if(err){
				mongodb.close();//问：为什么err之后要关闭mongodb,问：这是monggodb的连接么？答：每一次查出结果时，关闭连接？
				return callback.call(this,err);
			}
			collection.findOne({name:username},function(err,doc){
				if(doc){
					mongodb.close();
					var user = new User(doc);
					callback.call(this,err,user);
				}
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