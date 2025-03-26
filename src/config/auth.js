const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

class Auth {
  generateToken(username) {
    return jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

exports.auth = new Auth();
