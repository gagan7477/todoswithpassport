const { Pool } = require("pg");
const logger = require("../src/services/logger");

const testPool = new Pool({
  host: process.env.DB_HOST || '3.110.79.61',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: 'todos_test',
  user: process.env.DB_USER || 'app-user',
  password: process.env.DB_PASSWORD || 'demoapp@123',
});

module.exports = testPool;
