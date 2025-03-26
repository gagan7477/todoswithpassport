const logger = require("../services/logger");

exports.validate = (req, res, next) => {
  const { name, description } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    logger.warn("Validation failed: Invalid name");
    return res
      .status(400)
      .json({ error: "Name is required and must be a string" });
  }

  if (description && typeof description !== "string") {
    logger.warn("Validation failed: Invalid description");
    return res.status(400).json({ error: "Description must be a string" });
  }

  next();
};
