import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

export function configurePassport(app: express.Application) {

  // --- Session & Passport setup ---
  // Note: Ensure express-session is set up before passport
  app.use(session({ // Session middleware
    secret: 'secret', // Change this secret for production
    resave: false, // Don't save session if unmodified
    saveUninitialized: true // Save uninitialized sessions
  }));
  app.use(passport.initialize()); // Initialize Passport
  app.use(passport.session()); // Use Passport session

  passport.serializeUser((user, done) => done(null, user)); // Serialize user to session
  passport.deserializeUser((obj, done) => done(null, obj as Profile)); // Deserialize user from session

  // Google OAuth strategy
  // Note: Ensure to set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables
  passport.use(new GoogleStrategy({ 
    clientID:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:  '<https://localhost:3443/auth/google/callback>' // Update with your callback URL
  }, (accessToken, refreshToken, profile, cb) => cb(null, profile))); // Verify callback function
}
