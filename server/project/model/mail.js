/**
 *
 * @Description 邮件发送 
 * 调用方法:sendMail('amor_zhang@qq.com','这是测试邮件', 'Hi Amor,这是一封测试邮件');
 * @Author Amor
 * @Created 2016/04/26 15:10
 * 技术只是解决问题的选择,而不是解决问题的根本...
 * 我是Amor,为发骚而生!
 *
 */
var config = {
    service:'aliyun',
    user : 'tanjunyi@danlu.com',
    pass : 'lansezhaji@163.com'
} 
var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');


smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.service,
    auth: {
        user: config.user,
        pass: config.pass
    }
}));

/**
 * @param {String} recipient 收件人
 * @param {String} subject 发送的主题
 * @param {String} html 发送的html内容
 */
var sendMail = function (recipient, subject, html,callback) {

    smtpTransport.sendMail({

        from: config.user,
        to: recipient,
        subject: subject,
        html: html

    }, function (error, response) {
        if (error) {
            callback(false);
        }
        console.log('发送成功')
        callback(true);
    });
}

module.exports = sendMail;