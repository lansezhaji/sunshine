var express = require('express');
var router = express.Router();
var query=require("../model/mysql.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/**
 * 获得用户信息
 */
router.post('/getUserInfo', function(req, res, next) {
  var userId = req.body.id;
  query('select u_id as id,u_status as status, u_role as role, u_account as account , u_user_name as userName, u_last_time as lastLogin from user where u_id = ?',[userId],function(err,vals){
    if(err){
      console.log(err);
      res.json({
				status:'-1',
				msg:"数据库查询失败"
			})
    }else{
      var data = {
				status:0,
				data:{ },
				msg:""
			}
			console.log(vals);
			if(vals.length>0){
				data.data = vals[0]
			}else{
				data.status = -1;
				data.msg = "该用户id不存在"
			}
			
			res.json(data);
    }
  })
});
/**
 * 获得用户信息
 */
router.post('/updateUserInfo', function(req, res, next) {
  var userId 		= req.body.id
	var	account 	= req.body.account
	var	password 	= req.body.password
	var	userName 	= req.body.userName
	var	status 		= req.body.status
	var	role 			= req.body.role
	var userArr = [account,userName,status,role,userId];
  query('update user set u_account = ? ,u_user_name = ? , u_status = ?, u_role = ? where u_id = ?',userArr,function(err,vals){
    if(err){
      console.log(err);
      res.json({
				status:'-1',
				msg:"数据库操作失败"
			})
    }else{
      var data = {
				status:0,
				data:{ },
				msg:""
			}
			console.log(vals);
			if(vals.affectedRows >0 ){
				data.msg = "操作成功"
			}else{
				data.status = -1;
				data.msg = "该用户id不存在"
			}
			res.json(data);
    }
  })
});


module.exports = router;
