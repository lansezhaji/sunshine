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
  query('select u_id as id,u_account as account , u_user_name as userName, u_login_time as lastLogin from user where u_id = ?',[userId],function(err,vals){
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
module.exports = router;
