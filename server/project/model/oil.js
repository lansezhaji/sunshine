var mysql = require('../model/mysql')
/**
 * 时间戳转时间
 * @param timestamp 时间戳
 * @param isFull 是否需要时分秒
 * @return Promise 对象
 */
const timeFormat = (timestamp, format = 'YYYY-MM-DD hh:mm:ss') => {
    if (!timestamp) return '';
    var date = new Date(timestamp);
    var Y = date.getFullYear();
    var M =
        date.getMonth() + 1 >= 10
            ? date.getMonth() + 1
            : '0' + (date.getMonth() + 1);
    var D = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();
    var h = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours();
    var m =
        date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes();
    var s =
        date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds();

    var value = format
        .replace('YYYY', Y)
        .replace('MM', M)
        .replace('DD', D)
        .replace('hh', h)
        .replace('mm', m)
        .replace('ss', s);
    return value;
};

const promisify = (sql, arr) => {
    return new Promise((resolve, reject) => {
        console.log("======> ", sql)
        mysql.query(sql, [1], function (err, vals, fields) {
            if (err) {
                console.log("### ERR_MSG :", err.message)
                resolve({
                    status: -1,
                    msg: '查询失败',
                    data: ''
                })
            } else {
                resolve({
                    status: 0,
                    msg: '',
                    data: vals
                })
            }
        })
    });
};
const objectFormat = function (obj) {
    if (obj) {
        Object.keys(obj).forEach(key => {
            obj[key] = obj[key] || ''
        })
    }
    return obj
}

const oil = {
    getCarInfo(id) {
        let sql = 'select id, open_id, car_name from car_list where id = "?"  and is_delete=0 '
        return promisify(sql, [id])
    },
    // 获取加油列表数据
    getOilList(openId) {
        let sql = `select id, user_id, oil_time,create_time,price,oil_type,oil_amount, total_price from oil_list where open_id='${openId}' and is_delete=0 `
        return promisify(sql, [])
    },
    // 删除加油数据
    delete(id) {
        let sql = `delete from oil_list where id= ${id}`
        return promisify(sql)

    },
    // 查询上一次数据
    getLast(id) {
        let sql = `select * from oil_list where  oil_time < ( select oil_time from oil_list where id = ${id})  order by oil_time asc limit 1`
        return promisify(sql)
    },
    // 查询加油详情
    getDetail(id) {
        let sql = `select a.id,a.user_id,a.car_id, a.oil_time,a.create_time,a.price,a.oil_type,a.oil_amount, a.total_price,b.car_name ,a.mileage from oil_list as a left join car_list as b on a.car_id = b.id  where a.id=${id}`
        return promisify(sql, [])
    },
    add(oil) {
        oil = objectFormat(oil)
        const oil_time = timeFormat(new Date())
        const create_time = timeFormat(new Date())
        let sql = `insert into oil_list (user_id,open_id,car_id,oil_time,create_time,price,oil_type,oil_amount,total_price,mileage) values(${oil.user_id || ''},'${oil.open_id || ''}', ${oil.car_id || ''},'${oil_time || ''}','${create_time || ''}',${oil.price || ''},${oil.oil_type || ''},${oil.oil_amount || ''},${oil.total_price || ''},${oil.mileage || ''})`
        return promisify(sql, [])
    }
}
module.exports = oil;
