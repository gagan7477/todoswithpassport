const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const usersService = require("../services/users");
const logger = require("../services/logger");

// Serialization for sessions (even though we're stateless, best practice to include)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await usersService.findByEmail(profile.emails[0].value);

        if (!user) {
          // Create new user if doesn't exist
          user = await usersService.createUser(
            profile.displayName,
            profile.emails[0].value,
            null, // No password for OAuth users
            "google",
          );
        }

        return done(null, user);
      } catch (error) {
        logger.error("Google authentication error:", error);
        return done(error, null);
      }
    },
  ),
);

module.exports = passport;
