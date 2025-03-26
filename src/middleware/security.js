const helmet = require("helmet");
const logger = require("../services/logger");

const securityMiddleware = [
  helmet({
    // Disable automatic HTTPS upgrade
    upgradeInsecureRequests: false,
    // Allow HTTP connections
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "http:", "https:"],
        connectSrc: [
          "'self'",
          "http://*",
          "https://*.googleapis.com",
          "https://*.firebaseio.com",
        ],
        frameSrc: ["'self'", "https://*.firebaseapp.com"],
        objectSrc: ["'none'"],
      },
    },
  }),
];

module.exports = securityMiddleware;
