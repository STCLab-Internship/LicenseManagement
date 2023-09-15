var mysql = require('mysql2');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'stclab0601!!',
    database: 'license',
    enableKeepAlive: true
});

// var db = mysql.createConnection({
//     host: 'clover.stclab.com',
//     user: 'license_management',
//     password: 'wlslghkdlxld!!',
//     database: 'license_management',
//     enableKeepAlive: true
// });

// MySQL 데이터베이스에 연결
db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
    } else {
        console.log("MySQL connected");
    }
});

module.exports = db;