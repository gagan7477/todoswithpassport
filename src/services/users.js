const pool = require("../config/database");
const bcrypt = require("bcrypt");
const logger = require("./logger");

class UsersService {
  async createUser(username, email, password, provider = "local") {
    try {
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const query = `
                INSERT INTO users (username, email, password_hash, auth_provider) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, username, email, created_at, auth_provider`;
      const result = await pool.query(query, [
        username,
        email,
        hashedPassword,
        provider,
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      const query = "SELECT * FROM users WHERE username = $1";
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error finding user:", error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error finding user by email:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error("Error finding user by id:", error);
      throw error;
    }
  }

  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = new UsersService();
