import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { configurePassport } from './passport'; // Import passport configuration
import { configureMiddlewares } from './middlewares'; // Import middlewares configuration
import { configureRoutes } from './routes'; // Import routes configuration

const app = express();

configurePassport(app); // Configure Passport with the app
configureMiddlewares(app); // Configure middlewares with the app
configureRoutes(app); // Configure routes with the app

export default app;
