const { beforeAll, afterAll } = require("@jest/globals");
const testPool = require("./config/database.test");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.DB_DATABASE = "todos_test";

// Clean database before tests
beforeAll(async () => {
  try {
    await testPool.query("TRUNCATE users CASCADE");
  } catch (error) {
    console.error("Error in test setup:", error);
  }
});

afterAll(async () => {
  try {
    await testPool.end();
  } catch (error) {
    console.error("Error closing test pool:", error);
  }
});
