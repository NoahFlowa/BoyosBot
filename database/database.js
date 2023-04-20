const mysql = require('mysql');
const { pool } = require('./config/database');
const featureRequest = require('./models/featureRequest');

async function main() {
  // retrieve all feature requests
  const requests = await featureRequest.getAllRequests(pool);
  console.log(requests);
}

main();