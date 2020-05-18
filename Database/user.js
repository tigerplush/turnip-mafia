const Database = require('./Database');

const dbPath = process.env.DATABASE_PATH;
const userDbName = process.env.USER_DATABASE;
const userDb = new Database(dbPath, userDbName);

module.exports = userDb;