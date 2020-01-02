const query = require('../utils/query')
const jwt = require('jsonwebtoken');
const config = require('../config/default')
const { CREATE_TABLE, QUERY_TABLE } = require('../utils/sql')

const getBasicInfo = async (ctx) => {
    let data = ctx.request.body;
    if (Object.keys(data).length == 0) {
        let token = ctx.request.header.token ? ctx.request.header.token : '';
        let data = jwt.verify(token, config.jwtSecret);
        let user_id = data.id;
        let sql = `select company.*,user.user_name,user.phone_number from company left join user on company.user_id = user.user_id where company.user_id= '${user_id}'`;
        const companyInfo = await query(sql); // 数据库返回的数据
        ctx.body = {
            code: 0,
            success: true,
            retDsc: '公司信息查询成功',
            data: companyInfo[0]
        };
    } else {
        let sql = `update company c, user u set c.name='${data.name}',c.address='${data.address}',c.industry='${data.industry}',c.size='${data.size}',c.introduction='${data.introduction}', u.user_name='${data.user_name}',u.phone_number='${data.phone_number}' where c.id='${data.id}' and u.user_id='${data.user_id}'`;
        await query(sql);
        ctx.body = {
            code: 0,
            success: true,
            msg: '保存成功',
            data: null
        };
    }

}

const getCorpOrgRank = async (ctx) => {
    let sql = `select * from level`;
    let ranks = await query(sql);
    let sql2 = `select name,id,s_id from department`;
    let departments = await query(sql2);
    ctx.body = {
        code: 0,
        success: true,
        msg: '获取数据',
        data: {
            departments: departments,
            ranks: ranks
        }
    }
}

const getList = async (ctx) => {
    ctx.body = {
        code: 0,
        success: true,
        retDsc: '获取数据',
        data: {
            cost: [
                {
                    consumption: 20000,
                    save: 1200,
                    saveRate: '16%'
                }
            ],
            userInfo: [
                {
                    employees: 1000,
                    audit: 10,
                    travels: 300
                }
            ]
        }
    };
}

// 添加职级
const addRank = async (ctx) => {
    let data = ctx.request.body;
    let sql = `insert into level (name,level_no) values ('${data.name}','${data.level_no}')`;
    await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '保存成功',
        data: {}
    }
}
// 删除职级
const deleteRank = async (ctx) => {
    let data = ctx.request.body;
    let sql = `delete from level where id='${data.id}'`;
    let result = await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '删除成功',
        data: result.insertId
    }
}

// 添加员工
const addStaff = async (ctx) => {
    let data = ctx.request.body;
    let sql = `insert into employees (name,email,employees_no,phone_number,permissions,depart_id,rank_id) values ('${data.name}','${data.email}','${data.employees_no}','${data.phone_number}','${data.permissions}','${data.depart_id}','${data.rank_id}')`;
    let result = await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '保存成功',
        data: result.insertId
    }
}
// 编辑员工
const editorStaff = async (ctx) => {
    let { id, name, email, employees_no, phone_number, permissions, depart_id, rank_id } = ctx.request.body;
    let sql = `update  employees set name= '${name}' , email= '${email}',employees_no='${employees_no}',phone_number='${phone_number}',permissions='${permissions}',depart_id='${depart_id}',rank_id='${rank_id}' where id='${id}'`;
    let updateResult = query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '更新',
        data: updateResult.insertId
    }
}
//获取员工信息以及部门信息
const staffInfo = async (ctx) => {
    console.log(ctx,778);
    let { id, name, depart_id, rank_id, phone_number } = ctx.request.body;
    let sql = `select e.id,e.name,e.phone_number,e.employees_no, e.permissions, e.email, e.depart_id,e.rank_id,d.name as depart_ment,r.name as rank_name from employees e,department d,level r where e.depart_id=d.id and e.rank_id=r.id`;
    let arr = [];
    if (name) {
        name = `${name}`;
        sql += " and e.name = ?";
        arr.push(name);
    }
    if (phone_number) {
        phone_number = `${phone_number}`;
        sql += " and e.phone_number = ?";
        arr.push(phone_number);
    }
    if (id) {
        id = `${id}`;
        sql += " and e.id = ?";
        arr.push(id);
    }
    if (depart_id) {
        depart_id = `${depart_id}`;
        sql += " and e.depart_id = ?";
        arr.push(depart_id);
    }
    if (rank_id) {
        rank_id = `${rank_id}`;
        sql += " and e.rank_id = ?";
        arr.push(rank_id);
    }
    // sql += " limit ?,?";
    // arr.push((current-1)*num,parseInt(num));

    let employees = await query(sql, arr);

    ctx.body = {
        code: 0,
        success: true,
        msg: '获取成功',
        data: {
            employees: employees
        }
    }
}
//获取员工信息
const getEmployees = async (ctx) => {
    let { id } = ctx.request.query;
    let sql = `select * from employees where depart_id='${id}'`
    let employees = await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '获取成功',
        data: {
            employees: employees
        }
    }
}
// 新增部门
const addDepartment = async (ctx) => {
    let { name, depart_number, superiorId } = ctx.request.body;
    let sql = `insert into department (name,depart_number,s_id) values ('${name}','${depart_number}','${superiorId}')`;
    let result = await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '保存成功',
        data: {
            id: result.insertId
        }
    }
}

// 获取部门列表
const getDepartments = async (ctx) => {
    let sql = `select * from department`;
    let result = await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '查询成功！',
        data: {
            departments: result
        }
    }
}

// 获取职级列表
const getRanks = async (ctx) => {
    let sql = `select * from level`;
    let result = await query(sql);
    ctx.body = {
        code: 0,
        success: true,
        msg: '查询成功！',
        data: {
            ranks: result
        }
    }
}

//获取组织架构数据
const getOrganization = async (ctx) => {
    let obj = {};
    let sql4 = `select name,id,s_id from department where depth=0`;
    let res = await query(sql4);
    obj.name = res[0].name;
    obj.id = res[0].id;
    obj.s_id = res[0].s_id;
    obj.children = [];
    let sql5 = `select name,id,s_id from department where s_id='${res[0].id}'`;
    let result = await query(sql5);
    let children = [];
    for (let i = 0; i < result.length; i++) {
        let depart = {};
        depart.name = result[i].name;
        depart.id = result[i].id;
        depart.s_id = result[i].s_id;
        let sql = `select name,id, depart_id as s_id from employees where depart_id='${result[i].id}'`;
        let em = await query(sql);
        let sql6 = `select name,id,s_id from department where s_id='${result[i].id}'`;
        let q = await query(sql6);
        for (let i = 0; i < q.length; i++) {
            let sql = `select name,id, depart_id as s_id from employees where depart_id='${q[i].id}'`;
            let e = await query(sql);
            q[i].children = e;
            em.push(q[i]);
        }
        depart.children = em;
        children.push(depart)
    }
    obj.children = children;
    ctx.body = {
        code: 0,
        success: true,
        msg: '获取数据',
        data: {
            organizationals: [obj]
        }
    }
}

module.exports = {
    getBasicInfo,
    getCorpOrgRank,
    getList,
    addStaff,
    staffInfo,
    addRank,
    addDepartment,
    deleteRank,
    getDepartments,
    getRanks,
    editorStaff,
    getOrganization,
    getEmployees
}