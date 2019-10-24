//创建数据库

const CREATE_TABLE =`CREATE TABLE IF NOT EXISTS users2(
    user_id INT(5) NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (user_id)
);`.replace(/[\r\n]/g, '')


const QUERY_TABLE = (tableName)=>`select * from ${tableName}`






module.exports = {
    CREATE_TABLE,
    QUERY_TABLE
}