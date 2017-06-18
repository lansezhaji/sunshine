var express = require('express');
var router = express.Router();
var query = require("../model/mysql.js");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 获取列表
router.post('/getStackList', function(req, res, next) {
	var s_type = req.body.type;
	var queryArr = [s_type];
	query("select s_id as id , s_type as type, s_create_time as createTime ,u_user_name as createPerson ,s_title as title from user,stack where u_id = s_create_person and s_type=?",queryArr,function(err,vals,fields){
		if(err){
			res.json({
				status:'-1',
				msg:"查询失败"
			})
		}else{
			var data = {
				status:0,
				data:vals,
				msg:""
			}
			console.log(data);
			
			res.json(data);
		}

		//do something
	});

});
router.post('/getStackDetail', function(req, res, next) {
	var s_type = req.body.s_type;
	var s_id = req.body.stackId
	var queryArr = [s_id,s_type];
	query("select s_id as id , s_type as type, s_create_time as createTime ,u_user_name as createPerson ,s_title as title ,s_content as content  from user,stack where u_id = s_create_person and s_id = ? and s_type=?",queryArr,function(err,vals,fields){
		if(err){
			res.json({
				status:'-1',
				msg:"查询失败"
			})
		}else{
			var data = {
				status:0,
				data:vals[0],
				msg:""
			}
			console.log(data);
			
			res.json(data);
		}

		//do something
	});

});
router.post('/deleteStack', function(req, res, next) {
	var id = req.body.id;
	var queryArr = [id];
	query("delete from stack where s_id = ? ",queryArr,function(err,vals,fields){
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
			if(vals.affectedRows >0 ){
				data.msg = "删除成功"
			}else{
				data.status = -1
				data.msg = "删除失败"
			}
			console.log(vals);
			
			res.json(data);
		}

		//do something
	});

});

router.post('/saveStack', function(req, res, next) {
	var id = req.body.id ;
	
	var type = req.body.type;
	var createTime = req.body.createTime;
	var createPerson = req.body.createPerson;
	var title = req.body.title;
	var content = req.body.content;
	// var queryArr = [id,type,createTime,createPerson,title,content];
	// var sql = "insert into stack(s_id,s_type,s_create_time,s_create_person,s_title,s_content) values(?,?,?,?,?,?)"
	var queryArr = ""
	var sql = ""
	if(id){
		queryArr = [type,createTime,createPerson,title,content,id];
		sql = "update stack set s_type = ? ,s_create_time = ? ,s_create_person = ? ,s_title = ? , s_content = ? where s_id = ?"
	}else{
		queryArr = [id,type,createTime,createPerson,title,content];
		sql = "insert into stack(s_id,s_type,s_create_time,s_create_person,s_title,s_content) values(?,?,?,?,?,?)"
	}


	query(sql,queryArr,function(err,vals,fields){
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
			if(vals.affectedRows >0){
				data.data.msg = "保存成功"
			}else{
				data.data.msg = "保存失败"
			}

			console.log(vals);
			
			res.json(data);
		}

		//do something
	});

});
module.exports = router;
