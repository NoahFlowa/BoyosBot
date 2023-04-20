const { connectToDatabase } = require('./databaseConnection.js');
const mysql = require("mysql2");

async function getCommandStatus(commandName) {
    return new Promise((resolve, reject) => {
        const mysqlConnection = connectToDatabase();
        mysqlConnection.connect();

        const sql = `SELECT commandEnabled FROM activeCommands WHERE commandName = ?`;
        mysqlConnection.query(sql, [commandName], (err, result) => {
            mysqlConnection.end();

            if (err) {
                reject(err);
            } else {
                resolve(result[0].commandEnabled);
            }
        });
    });
}

module.exports = {
    getCommandStatus
};