const query = require('../utils/query')
const nodemailer = require('nodemailer');

const sendEmail = async (ctx) => { 
    let email = ctx.request.body.email;
    let html = ctx.request.body.html;
const transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
      user: "495035242@qq.com",
      pass: 'xycrngdcsbqqcbbd' //授权码,通过QQ获取
    }
    });
    const mailOptions = {
      from: "495035242@qq.com", // 发送者
      to: email, // 接受者,可以同时发送多个,以逗号隔开
      subject: '任命通知', // 标题
      //text: 'Hello world', // 文本
        html:html
    };
    
    transporter.sendMail(mailOptions, await ((err, info) => { 
        if (err) {
            console.log(err);
            return;
        }
        ctx.body = {
            code: 0,
            data:'发送成功'
        }
    }))

    // transporter.sendMail(mailOptions, function (err, info) {
       
    // })
}
  
const getTickets = async (ctx) => { 
    ctx.body = {
        code: 0,
        data: {
            list:[
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                },
                {
                    name: '海南航空',
                    price:750
                }
            ]
        }
    }
}
module.exports = {
    sendEmail,
    getTickets
}