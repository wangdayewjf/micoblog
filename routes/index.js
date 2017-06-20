var express = require('express');
var router = express.Router();
var User = require("../models/user.js");
var crypto = require('crypto');//问：这个需要安装么？


//问：这里面可以安装拦截器么？

router.get('/', function(req, res) {
	res.render('index', {
		title: "首页",
		layout: 'layout'
	});
});
router.get("/reg", function(req, res) {
	res.render("reg", {
		title: "用户注册"
	});
});
router.post("/reg",function(req,res){
	if(req.body["password-repeat"]!=req.body["password"]){
		req.flash("error","俩次输入的口令不一致");//这里哦的flush我暂且理解成，不一致，等会，安装一下flush
		return res.redirect("/reg");//问：重定向是默认的是Get吧？

	}
	var md5 = crypto.createHash("md5");//获得crypto中的md5加密工具
	var password = md5.update(req.body.password).digest("base64");//问：是不是最好在用base64加密，问：为什么俩次加密？解密不会困难么？
	var newUser = new User({
		name: req.body.username,
		password:password, 
	});
	User.get(newUser.name,function(err,user){
		if(user){
			err = "username already exist";//err在哪定义的？答：是个参数吧？
		}
		if(err){
			req.flash("error",err);
			return res.redirect("/reg");
		}
		newUser.save(function(err,inUser){
			if(err){
				req.flash("error",err);
				return res.redirect("/reg");
			}
			req.session.user = newUser ;//问：存在session里面？不是存在mongdb里面的么？问：这里的session知识一个形象其实还是req?,换句话说就是response里面的一个字段？问：这样会显示在页面中，还是为了保存user？也就是说保存到mogodb中？或者是俩者都有？
			req.flash("success","注册成功");
			res.redirect("/");
		});
	});
});
module.exports = router;
