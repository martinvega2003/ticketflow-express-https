import express, { Request, Response, NextFunction } from 'express';

export function configureMiddlewares(app: express.Application) {
  app.use(express.json());
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
