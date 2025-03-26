const logger = require("../services/logger");

module.exports = (err, req, res, next) => {
  logger.error("Error:", err);

  if (err.type === "validation") {
    return res.status(400).json({ error: err.message });
  }

  if (err.type === "not_found") {
    return res.status(404).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
};
