var express = require('express');
var router = express.Router();
var query=require("../model/mysql.js");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next) {
	var account = req.body.account;
	var password = req.body.password;
	var queryArr = [account,password];
	query("select u_id as id,u_account as account , u_user_name as userName from user where u_account =? AND u_password=?",queryArr,function(err,vals,fields){
		if(err){
			res.json({
				status:'-1',
				msg:"查询失败"
			})
		}else{
			var data = {
				status:0,
				data:{ },
				msg:""
			}
			console.log(vals);
			if(vals.length>0){
				data.data.userName = vals[0].userName
				data.data.id = vals[0].id
			}else{
				data.status = -1;
				data.msg = "用户名或者密码错误！"
			}
			
			res.json(data);
		}

		//do something
	});

});


module.exports = router;
