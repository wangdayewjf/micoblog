var express = require('express');
var router = require('./routes');
var app = express();
var path = require('path');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require("./settings");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var cookieSession = require('cookie-session');
partials = require('express-partials');

app.use(partials());
 app.use(flash());
app.set("views", __dirname + "/views");
app.set('view options', {
layout: true
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride())
app.use(cookieParser());
app.use(session({
	secret: settings.cookieSecret,
	store: new MongoStore({
		host: ' 127.0.0.1',
        port: '27017',
		db: settings.db,
		url: settings.url
		})
}));
//app.use(express.router(routes));

app.user(function(req,res,next){
	res.local.user = req.session.user;//问：这个会直接到mongodb数据库里面获取么？
	var err = req.flush("error");
	var success = req.flush("success");
	res.local.error = err.length?err:null;
	res.local.sucess = success.length?sucess:null;

	next();//执行下一个
});

app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3001);


module.exports = app;