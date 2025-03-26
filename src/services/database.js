const pool = require("../config/database");
const logger = require("./logger");

class Database {
  async create(todo) {
    const query =
      "INSERT INTO todos (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *";
    const values = [todo.name, todo.description];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Database create error:", error);
      throw error;
    }
  }

  async getAll() {
    try {
      const result = await pool.query(
        "SELECT * FROM todos ORDER BY created_at DESC",
      );
      return result.rows;
    } catch (error) {
      logger.error("Database getAll error:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
        id,
      ]);
      return result.rows[0];
    } catch (error) {
      logger.error("Database getById error:", error);
      throw error;
    }
  }

  async update(id, todo) {
    const query = `
            UPDATE todos 
            SET name = $1, description = $2, updated_at = NOW() 
            WHERE id = $3 
            RETURNING *`;
    const values = [todo.name, todo.description, id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error("Database update error:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const result = await pool.query(
        "DELETE FROM todos WHERE id = $1 RETURNING *",
        [id],
      );
      return result.rows[0];
    } catch (error) {
      logger.error("Database delete error:", error);
      throw error;
    }
  }
}

module.exports = new Database();
