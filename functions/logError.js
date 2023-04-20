// Import mysql connection
const { connectToDatabase } = require('./databaseConnection.js');

async function logError(errorMessage, errorLocation, encounteredBy) {
    return new Promise((resolve, reject) => {
        // Cleanse the error message
        errorMessage = errorMessage.replace(/'/g, "''");

        const mysqlConnection = connectToDatabase();
        mysqlConnection.connect();

        const sql = `INSERT INTO botErrorLogs (errorMessage, errorLocation, encounteredBy) VALUES (?, ?, ?, ?)`;
        mysqlConnection.query(sql, [errorMessage, errorLocation, encounteredBy], (err, result) => {
            mysqlConnection.end();

            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    logError
};