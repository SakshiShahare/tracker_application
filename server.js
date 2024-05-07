require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const { connectDB } = require('./connect/connect');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { homepage, fillDetails } = require('./controller/user.controller.js');
const trackerRouter = require('./route/tracker.route.js');
const { projectDetails, updateProject, deleteProject, getProject } = require('./controller/tracker.controller.js');
//////////////////////////////////////////////////////////////////////////////////////////////

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))




//tracker routes
app.post('/tracker/createProject' , projectDetails );
app.patch('/tracker/updateProject' , updateProject);
app.delete('/tracker/deleteProject/:id', deleteProject);
app.get('/tracker/getProject/:id' , getProject);





//Google session 
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
////////////////////////////////////////////////////////////////////////////////////////
//user path session 
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }) 
);

// Route for Google to redirect to after authentication.
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  (req, res) => {
    // Successful authentication, redirect based on whether user is logged in before or not.
    console.log(req.user)
    if (req.session.firstLogin) {
      // First time login, redirect to details page.
      res.redirect('/user/details');
    } else {
      // User has logged in before, redirect to homepage.
      res.redirect('/user/homepage');
    }
  }
);

// Example protected route. Make sure to implement your own authentication logic.
app.get('/user/homepage', homepage );
// Details page for first time login
app.post('/user/details', fillDetails );


////////////////////////////////////////////////////////////////////////////////////
//app listening session 
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports  = app;