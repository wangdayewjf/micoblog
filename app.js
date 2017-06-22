var express = require('express');
var router = require('./routes');
var app = express();
var path = require('path');
var flash = require("connect-flash");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require("./settings");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var cookieSession = require('cookie-session');
var partials = require('express-partials');
//var logger = require('morgan'); 原始logger写入方式
var log4js = require('log4js');
var fs = require('fs');
/*var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});*/
var log4js_config = require("./log4js.json");
log4js.configure(log4js_config);

var logger = log4js.getLogger('normal');
logger.setLevel('INFO');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

//app.use(logger('dev'));
//app.use(logger('combined',{stream: accessLogfile}));//添加访问日志。
app.use(partials());

app.set("views", __dirname + "/views");
app.set('view options', {
	layout: true
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride())
app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
  
}
if ("production" == env){
	app.error(function(err,req,res,next){
		var meta = '['+ new Date() + ']'+req.url+'\n';
		errorLogfile.write(meta + err.stack + "\n");
		next();
	});
}
//app.use(express.router(routes));
app.use(session({
	secret: settings.cookieSecret,
	key:settings.db,                        //cookie的名字  
    cookie:{maxAge:1000*60*60*24*30},  
	store: new MongoStore({
		host: ' 127.0.0.1',
        port: '27017',
		db: settings.db,
		url: settings.url
		}),
	resave:true,  
    saveUninitialized:false
}));
app.use(flash());

app.use(function(req,res,next){
	
	var user = req.session.user;//问：这个会直接到mongodb数据库里面获取么？
	var err = req.flash("error");
	var success = req.flash("success");//问：这里面如果还没有值怎么办？回自动生成一个key?,答：先走前面完成赋值，重定向然后再在这里取出来？
	res.locals.error = err.length?err:null;
	res.locals.success = success.length?success:null;
	res.locals.user = user;
	next();//执行下一个
});//拦截器的作用。debug一下看谁先执行，谁后执行。
app.use(express.static(path.join(__dirname, 'public')));

app.use(router);


app.listen(3001);


module.exports = app;