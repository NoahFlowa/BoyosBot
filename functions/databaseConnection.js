const mysql = require("mysql2");
const { hostName, port, userName, password, databaseName } = require('../config.json');

function connectToDatabase() {
    var mysqlConnection = mysql.createConnection({
        host: hostName,
        port: port,
        user: userName,
        password: password,
        database: databaseName
    });

    return mysqlConnection;
}

module.exports = {
    connectToDatabase
};