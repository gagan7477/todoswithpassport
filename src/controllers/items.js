const database = require("../services/database");
const logger = require("../services/logger");

exports.getAllItems = async (req, res) => {
  try {
    const items = await database.getAll();
    res.json(items);
  } catch (error) {
    logger.error("Error getting items:", error);
    res.status(500).json({ error: "Failed to retrieve items" });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await database.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    logger.error("Error getting item:", error);
    res.status(500).json({ error: "Failed to retrieve item" });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await database.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    logger.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await database.update(req.params.id, req.body);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    logger.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await database.delete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};
