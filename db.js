const mysql = require("mysql2");
const pool = mysql.createPool({
    host: "127.0.0.1",
    port:"3307",
    user: "root",
    password: "YOUR_PASSWORD",
    database: "dma_demo"
});

module.exports = pool.promise();
