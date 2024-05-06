
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
  }));
  
  // Passport session setup.
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
  
  // Google OAuth strategy configuration.
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // This is where you would typically save user profile information to your database.
      // For this example, we'll just return the profile.
      return done(null, profile);
    }
  ));
  
  // Middleware to initialize Passport and session
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Route to start the OAuth flow.


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route for Google to redirect to after authentication.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect based on whether user is logged in before or not.
    if (req.session.firstLogin) {
      // First time login, redirect to details page.
      res.redirect('/details');
    } else {
      // User has logged in before, redirect to homepage.
      res.redirect('/');
    }
  }
);

// Example protected route. Make sure to implement your own authentication logic.
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.displayName}!`);
  } else {
    res.redirect('/login');
  }
});

// Details page for first time login
app.get('/details', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Welcome to the details page. Please provide additional information.');
  } else {
    res.redirect('/login');
  }
});

module.exports = app;