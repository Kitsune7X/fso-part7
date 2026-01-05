import express from 'express';
import blogRouter from './controllers/blogs.js';
import userRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import testingRouter from './controllers/testing.js';
import config from './utils/config.js';
import logger from './utils/logger.js';
import mongoose from 'mongoose';
import {
  errHandler,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  reqLogger,
} from './utils/middleware.js';
import morgan from 'morgan';

// Call the Express factory function to create app instance
const app = express();

// ---------- Initial logging status ----------
logger.info('Connecting to', config.MONGODB_URI);

// ---------- Morgan ----------
morgan.token('body', (req) => JSON.stringify(req.body));
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length] :body',
    ),
  );
}

// ---------- Connect to MongoDB ----------
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('Error connecting to MongoDB', err.message));

// ---------- Parse Json ----------
app.use(express.json());

// ---------- Logging request ----------
app.use(reqLogger);

// ---------- Token extractor ----------
app.use(tokenExtractor);

// ---------- Welcome page ----------
app.get('/', (req, res) => res.send('<h1>WELCOME!</h1>'));

// ---------- Pass request to '/api/blogs' to router 'mini-app' ----------
app.use('/api/blogs', userExtractor, blogRouter);

// ---------- Pass request to '/api/login' to login router ----------
app.use('/api/login', loginRouter);

// ---------- Pass request to '/api/users' to user router ----------
app.use('/api/users', userRouter);

// Reset database for testing route
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}

// ---------- Handle invalid address ----------
app.use(unknownEndpoint);

// ---------- Handle error ----------
app.use(errHandler);

export default app;
