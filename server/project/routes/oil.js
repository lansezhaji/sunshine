var express = require('express');
var router = express.Router();
var oil = require("../model/oil");
const request = require('request')
var utils = require('../utils/common')
var crypto = require('crypto')

// redis存储用户登录信息
var redis = require("redis"),
    client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

client.getKey = (key, field) => {
    return new Promise((resolve, reject) => {
        client.hget(key, field, function (err, obj) {
            if (obj) {
                resolve(obj)
            } else {
                resolve()
            }
        })
    })
}
// 登录拦截
router.use('/', async function (req, res, next) {
    if (req.path.indexOf('login') < 0) {
        console.log(req.headers)
        const _head = JSON.parse(req.headers._head)
        const { token } = _head;
        console.log('-------------', token)

        if (token) {
            const openId = await client.getKey(token, 'openId');
            if (openId) {
                req.user = {
                    openId
                }
                return next();
            }
        }
        res.json({
            status: 302,
            msg: '登录失效，请重新登录'
        })

    } else {
        next();
    }
})
router.post('/login', async (req, res, next) => {
    const { appId, jsCode } = req.body;
    const result = await utils.request.get('https://api.weixin.qq.com/sns/jscode2session', {
        appid: appId,
        secret: 'e6e480d79141b1ab8a3e9f0526a218d5',
        js_code: jsCode,
        grant_type: 'authorization_code'
    })
    const str = result.session_key + Date.now() + result.openid;
    if (result.openid) {
        const token = crypto.createHash('sha1').update(str, 'utf8').digest('hex')
        client.hset(token, 'openId', result.openid)
        res.json({
            status: 0,
            data: {
                token
            }
        })
    } else {
        res.json({
            status: -1,
            msg: '解析用户数据出错！'
        })
    }
})

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
/**
 * 获得用户信息
 */

router.get('/getOilList', async function (req, res, next) {

    const info = await oil.getOilList(req.user.openId);
    console.log('------- info -----', info)
    res.json(info)
})
/**
 * 删除加油数据
 */
router.get('/delete', async function (req, res, next) {

    const info = await oil.delete(req.query.id);
    res.json(info)
})
/**
 * 删除加油数据
 */
router.get('/addCar', async function (req, res, next) {

    const param = {
        number: req.query.number,
        openId: req.user.openId,
    }
    const info = await oil.addCar(param);
    res.json(info)
})
/**
 * 删除加油数据
 */
router.get('/deleteCar', async function (req, res, next) {

    const info = await oil.deleteCar(req.query.id);
    res.json(info)
})
/**
 * 获取汽车列表
 */
router.get('/carList', async function (req, res, next) {

    const info = await oil.carList(req.user.openId);
    res.json(info)
})
/**
 * 获取加油记录列表
 */
router.get('/detail', async function (req, res, next) {

    const info = await oil.getDetail(req.query.id);
    const last = await oil.getLast(req.query.id);
    const detail = info.data[0] || {}
    const lastDetail = last.data[0]
    if (lastDetail) {
        detail.hasLast = true
        //上次加油时间
        detail.last_time = lastDetail.oil_time;
        detail.duration = ((new Date(detail.oil_time).getTime() - new Date(detail.last_time).getTime()) / 1000 / 60 / 60 / 24).toFixed(1)
        // 计算公里数
        detail.distance = detail.mileage - lastDetail.mileage
        // 计算平均价格
        detail.univalence = (detail.total_price / detail.distance).toFixed(4)
        // 计算百公里油耗
        detail.consumption = (detail.oil_amount / detail.distance * 100).toFixed(4)

    }
    console.log('------- info -----', info)
    res.json(info)
});

router.post('/add', async function (req, res, next) {
    const params = req.body;
    params.open_id = req.user.openId;
    const info = await oil.add(params);

    console.log('------- add -----', info)
    res.json(info)
});

module.exports = router;
