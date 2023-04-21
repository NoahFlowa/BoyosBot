const { connectToDatabase } = require('./databaseConnection.js');
const mysql = require("mysql2");

async function getUserPermissions(userID) {
    return new Promise((resolve, reject) => {
        const mysqlConnection = connectToDatabase();
        mysqlConnection.connect();

        const sql = `SELECT permissionID FROM Users WHERE discordUserID = ?`;
        mysqlConnection.query(sql, [userID], (err, result) => {
            mysqlConnection.end();

            if (err) {
                reject(err);
            } else {
                resolve(result[0].permissionID);
            }
        });
    });
}

module.exports = { getUserPermissions };