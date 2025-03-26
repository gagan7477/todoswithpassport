const { Pool } = require("pg");
const logger = require("../services/logger");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || '3.110.79.61',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'todos',
  user: process.env.DB_USER || 'app-user',
  password: process.env.DB_PASSWORD || 'demoapp@123',
  max: parseInt(process.env.DB_POOL_MAX || "20"),
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || "30000"),
  connectionTimeoutMillis: parseInt(
    process.env.DB_POOL_CONNECTION_TIMEOUT || "2000",
  ),
});

// Add error handling for the pool
pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.on("connect", () => {
  logger.info("New client connected to database");
});

module.exports = pool;
