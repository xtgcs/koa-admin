const query = require('../utils/query')
const bcrypt = require('bcryptjs');
// const JWT = require('koa-jwt');
const jwt = require('jsonwebtoken');
const config = require('../config/default')
const { CREATE_TABLE, QUERY_TABLE } = require('../utils/sql')
// 获取用户信息
const getUserInfo = async (ctx)=>{
    ctx.body = {
        code:0,
        success: true,
        retDsc: '获取用户信息',
        data: {
            roles: ['admin'],
            introduction: 'I am a super administrator',
            avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name: 'Super Admin'
        }
    }

}
// 退出登录
const logout = async (ctx) => { 
    ctx.body = {
        code:0,
        success: true,
        retDsc: '退出登录',
        data: {
            
        }
    }
}

// 注册
const setUserAuth = async (ctx) => { 
    const data = ctx.request.body; // post过来的数据存在request.body里    
    const password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
    let sql = `insert into user (password,email,phone_number,user_name) values ('${password}','${data.email}','${data.phoneNumber}','${data.contactPerson}') `;
    let result = await query(sql); // 数据库返回的数据
    let sql2 = `insert into company (name,industry,size,user_id) values('${data.companyName}','${data.industry}','${data.size}','${result.insertId}')`
     await query(sql2); // 数据库返回的数据
     ctx.body = {
        code: 0,
        success: true,
        msg: '注册成功！',
        data: null
    }
}

// 用户登录
const postUserAuth = async function postUserAuth(ctx) {    
    const data = ctx.request.body; // post过来的数据存在request.body里  
    let sql = "";    
    if (isPoneAvailable(data.username)) {
        sql = `select * from user where phone_number = '${data.username}'`;
    } else if (isEmailAvailable(data.username)) { 
        sql = `select * from user where email = '${data.username}'`;
    } else { 
        ctx.body = {
            code: 60204,
            success: false,
            msg: '用户名格式不正确',
            data: null
        };
        return
    }
    const userInfo = await query(sql); // 数据库返回的数据
    const user = userInfo[0] ? userInfo[0] : null;   
    if (!user) {
        ctx.body = {
            code: 60204,
            success: false,
            msg: '用户不存在',
            data: null
        };
        return
    }
    if (!bcrypt.compareSync(data.password, user.password)) {
        ctx.body = {
            code: 60203,
            success: false,
            msg: '密码错误',
            data: null
        };
        return
    }
    const userToken = {
        phone_number: user.phone_number,
        email:user.email,
        id: user.user_id,
    };
    const secret = config.jwtSecret; // 指定密钥，这是之后用来判断token合法性的标志
    const token = jwt.sign(userToken, secret, {
        expiresIn:config.expiresIn
    }); // 签发token
    ctx.body = {
        code:0,
        success: true,
        msg: '登陆成功',
        data: {
            token,
        }
    }
}

function isPoneAvailable (pone){
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
}

function isEmailAvailable(emailInput) {
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!myreg.test(emailInput)) {
        return false;
    }
    else {
        return true;
    }
}

const tokens = {
    admin: {
      token: 'admin-token'
    },
    editor: {
      token: 'editor-token'
    }
  }
  
  const users = {
    'admin-token': {
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    },
    'editor-token': {
      roles: ['editor'],
      introduction: 'I am an editor',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Normal Editor'
    }
  }

module.exports = {
    getUserInfo,
    postUserAuth,
    setUserAuth,
    logout
}