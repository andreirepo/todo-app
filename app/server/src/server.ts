import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db';

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Database connection
connectDB();

// Route imports
import todos from '../routes/todos';

// Create Express application
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/todos', todos);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Todo API running' });
});

// API root endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({ status: 'Todo API running' });
});

// Server configuration
const port: number = Number(process.env.PORT) || 5000;

const server = app
  .listen(port, () => {
    console.log(
      colors.yellow.bold(
        `Server started in ${process.env.NODE_ENV} mode on port ${port}`
      )
    );
  })
  .on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      const altPort = port + 1;
      console.log(colors.red(`Port ${port} in use, trying ${altPort}`));
      server.listen(altPort);
    }
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error | any, promise: Promise<any>) => {
  console.log(colors.red(`Error: ${err.message || err}`));
  server.close(() => process.exit(1));
});