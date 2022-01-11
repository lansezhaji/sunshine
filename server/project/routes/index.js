var express = require('express');
var router = express.Router();
var query = require("../model/mysql.js");
var fs = require("fs")
var path = require("path")
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  var account = req.body.account;
  var password = req.body.password;
  var queryArr = [account, password];
  mysql.query("select u_id as id,u_account as account , u_user_name as userName from user where u_account =? AND u_password=?", queryArr, function (err, vals, fields) {
    if (err) {
      res.json({
        status: '-1',
        msg: "查询失败"
      })
    } else {
      var data = {
        status: 0,
        data: {},
        msg: ""
      }
      if (vals.length > 0) {
        data.data.userName = vals[0].userName
        data.data.id = vals[0].id
        // 更新最后登录时间
        var time = new Date();
        var timeS = time.getTime();
        mysql.query('update user set u_last_time = u_login_time,u_login_time = ? where u_id = ?', [timeS, vals[0].id], function () {
          console.log("更新登录时间成功");
        })
      } else {
        data.status = -1;
        data.msg = "用户名或者密码错误！"
      }

      res.json(data);
    }

    //do something
  });

});

router.get('/test', function (req, res, next) {
  res.json({
    data: `收到消息：${JSON.stringify(req.query)}`
  })
});


module.exports = router;
