var express = require('express');
var router = express.Router();
var oil = require("../model/oil");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
/**
 * 获得用户信息
 */

/**
 * 获得用户信息
 */
router.get('/detail', async function (req, res, next) {
  var id = req.query.id;
  const info = await oil.getDetail(id);
  console.log('------- info -----', info)
  res.json(info)
});

router.post('/add', async function (req, res, next) {
  const info = await oil.add(req.body);
  console.log('------- add -----', info)
  res.json(info)
});

module.exports = router;
