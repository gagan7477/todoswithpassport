const database = require("../services/database");
const logger = require("../services/logger");

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await database.getAll();
    res.json(todos);
  } catch (error) {
    logger.error("Error getting todos:", error);
    res.status(500).json({ error: "Failed to retrieve todos" });
  }
};

exports.getTodo = async (req, res) => {
  try {
    const todo = await database.getById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    logger.error("Error getting todo:", error);
    res.status(500).json({ error: "Failed to retrieve todo" });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const todo = await database.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    logger.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await database.update(req.params.id, req.body);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    logger.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await database.delete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
