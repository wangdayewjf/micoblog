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
app.use(router);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3001);


module.exports = app;