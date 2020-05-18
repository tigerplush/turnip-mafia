const Database = require('./Database');

const dbPath = process.env.DATABASE_PATH;
const turnipDbName = process.env.TURNIP_PRICES_DATABASE;
const turnipPrices = new Database(dbPath, turnipDbName);

module.exports = turnipPrices;