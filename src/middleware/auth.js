const { auth } = require("../config/auth");
const logger = require("../services/logger");
const usersService = require("../services/users");

exports.authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await auth.verifyToken(token);

    const user = await usersService.findByUsername(decodedToken.username);
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};
