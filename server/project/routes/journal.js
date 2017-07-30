var express = require('express');
var router = express.Router();
var mysql=require("../model/mysql.js");
var sendMail = require("../model/mail.js");
/* 获取日报列表 */
router.get('/getJouralList', function(req, res, next) {
    var user_id = req.query.userId || 0;
    
    var sql1 = "select u_user_name from user where u_id="+user_id;
    var sql2 = 'select * from journal where user_id ='+user_id +' ORDER BY time desc'
    var sql = sql1+';'+sql2
    mysql.multiQuery(sql,function(err,results){
        if(err){
            res.send('数据库查询失败:'+err);
        }else{
            var userName = ""
            if(results[0] && results[0][0]){
                userName = results[0][0].u_user_name
            }
            var resData = {
                userName : userName,
                status : 0,
                data:[],
                msg : ''
            }
            // 根据日期筛选数据
            var jourList = [];
            if(results[1].length>0){
                results[1].forEach(function(element) {
                    // 获取日期信息
                    var dayTime = new Date(element.time).toDateString();
                    var isNew = true;
                    jourList.forEach(function(item){
                        var dayTime1 = new Date(item.time).toDateString();
                        // 已经有该日数据
                        if(dayTime1 == dayTime){
                            if(element.type == 0){
                                item.done.push(element.content);
                            }else{
                                item.todo.push(element.content);
                            }
                            isNew = false;
                        }
                        
                    })
                    // 没有该日数据
                    if(isNew){
                        var joural = {
                            time : element.time,
                            done : [],
                            todo : []
                        }
                        if(element.type == 0){
                            joural.done.push(element.content);
                        }else{
                            joural.todo.push(element.content);
                        }
                        jourList.push(joural);
                    }
                });
            }
            resData.data = jourList;
           res.json(resData);  
        }
       
    });
});
function getEmailTemp(email){
    var planDone = email.planDone;
    var done = email.done;
    var todo = email.todo;
    var question = email.question || '暂无'
    var html = "<h4>计划完成工作：</h4>"
    planDone.forEach(function (item,index) {
      html += '<li style="list-style-type: none;margin-left: 20px">'+(index+1)+'.' + item + '</li>'
    })
    html +=  '<h4>实际完成工作：</h4>';
    done.forEach(function (item,index) {
      html += '<li style="list-style-type: none;margin-left: 20px">'+(index+1)+'.' + item + '</li>'
    })
    html +=  '<h4>明日工作计划：</h4>';
    todo.forEach(function (item,index) {
      html += '<li style="list-style-type: none;margin-left: 20px">'+(index+1)+'.' + item + '</li>'
    })
    html +=  '<h4>遇到的问题：</h4>';
    html += question;
    console.log(html);
    return html;
}
// 获取今日计划
router.get('/getPlan',function(req,res,next){
    var user_id = req.query.userId || 0;
    var sql1 = "select u_user_name from user where u_id="+user_id;
    var sql2 = "select * from journal where user_id="+user_id+" ORDER BY time desc limit 1";
    console.log(sql1);
    console.log(sql2);
})
// 新建日报
router.post('/addJoural', function(req, res, next) {
	var user_id = req.body.userId ;
    var time = new Date();
    var timeStamp = time.valueOf();
    var doneList = req.body.done;
    var todoList = req.body.todo;
    var toEmail = req.body.toEmail;
    // var timeStr = time.toLocaleString();
    var emailTitle = req.body.title || "暂无标题";
    var emailContent =  getEmailTemp(req.body);

    sendMail(toEmail,emailTitle,emailContent,function(){
        var sql = 'insert into journal values';
        var sqlArr = [];
        // 已完成
        doneList.forEach(function(item,index){
            sqlArr.push('(null,'+user_id+',0,'+timeStamp+',"'+item+'")')
        })
        // 计划完成
        todoList.forEach(function(item,index){
            sqlArr.push('(null,'+user_id+',1,'+timeStamp+',"'+item+'")')
        })
        sql += sqlArr.toString();
        mysql.query(sql,function(err,vals,fields){
            if(err){
                res.json({
                    status : -1,
                    data:"",
                    msg : "数据库查询失败"
                })
                console.log("数据库查询失败"+err);
            }else{
                res.json({
                    status : 0,
                    data:"",
                    msg : "新增成功"
                })
            }
        })
    });



});

module.exports = router;
