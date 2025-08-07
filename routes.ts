import express, { Request, Response } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from './middlewares.js';
import { v4 as uuidv4 } from 'uuid';

export function configureRoutes(app: express.Application) {
  app.get('/', (_req, res: Response) => {
    res.send('¡Hi from HTTPS + TypeScript!');
  });

  // OAuth
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile','email'] })); // Trigger Google login 
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), // Handle Google callback
    (_req, res: Response) => res.redirect('/protected') // Redirect to protected route on successful login
  );
  app.get('/protected', ensureAuthenticated, (req, res: Response) => { // Protected route with ensureAuthenticated middleware
    const user = req.user as any; // Cast to any to access displayName
    res.send(`¡Hola ${user.displayName}!`); // Greet authenticated user
  });

  // Tickets endpoint
  app.post('/tickets', (req: Request, res: Response) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Field "title" is required' });
    }
    res.status(201).json({ 
      id: uuidv4(), 
      title, 
      description: description ?? '' 
    }); // Create and return new ticket with UUID
  });
}
