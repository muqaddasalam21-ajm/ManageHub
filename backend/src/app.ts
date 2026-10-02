import express, { Application } from 'express';
import cors from 'cors';
import { config } from './config/env';
import apiRouter from './routes';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/v1', apiRouter);

// Centralized Error Handling
app.use(errorHandler);

// Start server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`Backend server running on http://localhost:${config.port}`);
    console.log(`Health check: http://localhost:${config.port}/api/v1/health`);
  });
}

export default app;
