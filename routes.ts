import express, { Request, Response } from 'express';
import passport from 'passport';
import { ensureAuthenticated } from './middlewares.js';
import { getDb } from './database.js';
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

  // Webhook endpoint
  app.post('/webhook', async (req: Request, res: Response) => {
    const { id, action } = req.body ?? {};

    if (!id || !action) {
      return res.status(400).json({ error: 'Missing id or action' });
    }

    try {
      const db = await getDb();

      if (action === 'resolve' || action === 'solve' || action === 'close') {
        // run returns an object with properties as changes (number of rows affected)
        const result = await db.run('UPDATE tickets SET status = ? WHERE id = ?', 'Solved', id);

        // In sqlite wrapper, result.changes can come in different shapes; normally it's an object with changes or lastID
        // Use optional chaining to handle both cases
        // If changes is 0, it means no rows were updated, so a 404 is returned
        // If changes is not 0, the id and status are returned as a success response
        // If lastID is present, it means an insert was made, but in this case it is only being updated, so changes checked:
        const changes = (result as any).changes ?? (result as any).lastID ?? 0;

        if ((result as any).changes === 0) {
          return res.status(404).json({ error: 'Ticket not found' });
        }

        return res.status(200).json({ ok: true, id, status: 'Solved' });
      } else {
        return res.status(400).json({ error: 'Unknown action' });
      }
    } catch (err) {
      console.error('Webhook DB error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}
