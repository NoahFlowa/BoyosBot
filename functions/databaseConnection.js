const mysql = require("mysql2");

const hostName = process.env.hostName
const port = process.env.port
const userName = process.env.userName
const password = process.env.password
const databaseName = process.env.databaseName

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