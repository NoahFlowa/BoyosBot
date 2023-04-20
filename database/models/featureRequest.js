// * Require necessary MySQL classes
const mysql = require('mysql');
const { hostName, port, userName, password, databaseName } = require('../../config.json');

// create connection pool
const pool = mysql.createPool({
    host: hostName,
    port: port,
    user: userName,
    password: password,
    database: databaseName,
});

// create featureRequests table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS featureRequests (
    requestID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    request TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy VARCHAR(255) NOT NULL,
    PRIMARY KEY (requestID)
  );
`);