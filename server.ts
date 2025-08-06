import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

const app = express();

// --- Session & Passport setup ---
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Serialize & deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj as Profile));

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL:  'https://localhost:3443/auth/google/callback'
}, (accessToken, refreshToken, profile, cb) => cb(null, profile)));

// --- Routes ---

// Public home
app.get('/', (req: Request, res: Response) => {
  res.send('¡Hola desde HTTPS + TypeScript en M1!');
});

// Trigger Google login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    res.redirect('/protected');
  }
);

// Protected route middleware
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.redirect('/');
}

// Protected content
app.get('/protected', ensureAuthenticated, (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user as Profile;
  res.send(`¡Hola ${user.displayName}!`);
});

// --- HTTPS Server Setup ---
const options = {
  key:  fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

https.createServer(options, app)
  .listen(3443, () => {
    console.log('Servidor HTTPS escuchando en https://localhost:3443');
  });