// 引用mysql2套件
const mysql = require('mysql2');

// https://www.npmjs.com/package/mysql2#using-connection-pools

// 設定資料庫連線的參數
const pool = mysql.createPool({
    host: 'localhost',
    user: 'allmight',
    password: '666',
    database: 'project11',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();