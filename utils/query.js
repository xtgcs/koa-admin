const mysql = require('mysql');
const MYSQ_LCONFIG = require('../config/mysql_config');

//mysql
const pool = mysql.createPool(MYSQ_LCONFIG);

//query sql语句

const query = (sql,val) => { 
    return new Promise((resolve, reject) => { 
        pool.getConnection(function (err, connection) { 
            if (err) {
                reject(err)
            } else { 
                connection.query(sql, val, (err, fields) => { 
                    if (err) {
                        reject(err)
                    } else { 
                        resolve(fields)
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports = query;