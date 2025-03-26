require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");
const errorMiddleware = require("./middleware/error");
const securityMiddleware = require("./middleware/security");
const logger = require("./services/logger");
const pool = require("./config/database");
const path = require("path");

const app = express();

// Database connection check
const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info(
      `Successfully connected to PostgreSQL database at ${process.env.DB_HOST}:${process.env.DB_PORT}`,
    );
    client.release();
  } catch (error) {
    logger.error("Database connection error:", error);
    process.exit(1); // Exit if database connection fails
  }
};

// Initialize database connection
checkDatabaseConnection();

// Middleware
app.use(express.json());
app.use(securityMiddleware);

// Static files configuration - place this before routes
app.use("/static", express.static("public"));
app.use(express.static(path.join(__dirname, "..", "public")));

// Serve static files from public directory
app.use(express.static("public"));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
    endpoints: {
      todos: "/api/todos",
      documentation: "/api-docs",
    },
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

// Error handling
app.use(errorMiddleware);

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(
      `Swagger documentation available at http://localhost:${PORT}/api-docs`,
    );
  });
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  pool.end(() => {
    logger.info("Database pool has ended");
    process.exit(0);
  });
});

module.exports = app;
