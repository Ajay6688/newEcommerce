const mysql = require("mysql2");
const config = require('config');

const conn = mysql.createConnection(config.get('dbconfig'));

module.exports = {
    conn
}