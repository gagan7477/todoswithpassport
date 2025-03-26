const { auth } = require("../config/auth");
const usersService = require("../services/users");
const logger = require("../services/logger");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await usersService.createUser(username, email, password);
    const token = auth.generateToken(username);
    res
      .status(201)
      .json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
  } catch (error) {
    if (error.constraint) {
      switch (error.constraint) {
        case "users_username_key":
          return res.status(400).json({ error: "Username already exists" });
        case "users_email_key":
          return res.status(400).json({ error: "Email already registered" });
        default:
          logger.error("Unknown constraint error:", error);
      }
    }
    logger.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersService.findByUsername(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await usersService.verifyPassword(
      password,
      user.password_hash,
    );
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = auth.generateToken(username);
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const token = auth.generateToken(req.user.username);
    const userStr = encodeURIComponent(
      JSON.stringify({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      }),
    );

    // Redirect to frontend with token and user info
    res.redirect(`/?token=${token}&user=${userStr}`);
  } catch (error) {
    logger.error("Google callback error:", error);
    res.redirect("/?error=auth_failed");
  }
};
