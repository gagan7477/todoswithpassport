const { Pool } = require("pg");
const logger = require("../src/services/logger");

const testPool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "2024"),
  database: "todos_test",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password02",
});

module.exports = testPool;
