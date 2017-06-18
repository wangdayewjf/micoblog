var express = require('express');
var router = express.Router();
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
module.exports = router;
