const req = require('request')

const promisefy = function (fn, ...opts) {
    return new Promise((resolve, reject) => {
        fn(...opts, {
            success: (res) => {
                resolve(res);
            }
        });
    });
};
/**
 * 将url与json参数进行拼装
 * @param {*} url : http://www.baidu.com
 * @param {*} params { name :Caroline}
 * @return http://www.baidu.com?name=Caroline
 */
const appendUrl = function (url = "/", params = {}) {
    if (JSON.stringify(params) !== "{}") {
        url += url.indexOf("?") >= 0 ? "&" : "?";
        for (var param in params) {
            url += url[url.length - 1] === "?" ? "" : "&";
            url += param + "=" + params[param];
        }
    }
    return url;
};


const request = {
    get: function (url, param) {
        url = appendUrl(url, param)
        return new Promise((resolve, reject) => {
            req.get(url, param, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    body = JSON.parse(body)
                    if (!body.errcode) {
                        resolve(body)
                    } else {
                        console.log(" ### ERROR ### ", body.errmsg)
                        resolve({
                            status: -1,
                            msg: '解析用户数据出错！'
                        })
                    }
                } else {
                    resolve({
                        status: -1,
                        msg: '网络错误'
                    })
                }
            })
        })
    },
    post: function (url, param) {
        return new Promise((resolve, reject) => {
            req.post(url, param, s => {
                resolve(s)
            }, n => {
                reject(n)
            })
        })
    },
}

module.exports = {
    promisefy,
    request,
    appendUrl
}