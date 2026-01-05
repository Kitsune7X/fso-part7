import logger from './logger.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// ---------- Request logger ----------
const reqLogger = (req, res, next) => {
  logger.info('----------------');
  logger.info('Method ', req.method);
  logger.info('Path ', req.path);
  logger.info('Body ', req.body);
  logger.info('----------------');
  next();
};

// ---------- Token extractor ----------
const tokenExtractor = (req, res, next) => {
  if (req.method === 'GET') return next();

  // Note to self: Express only call middleware with a `req` object, it won't run
  // without one. Early version had `if (!req) return null` but it is unnecessary
  const authorization = req.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.slice(7); // Slice and return a new str at where 'Bearer ' end
  }

  next();
};

// ---------- User extractor ----------
const userExtractor = async (req, res, next) => {
  if (req.method === 'GET') return next();
  if (!req.token) return res.status(401).json({ error: 'Token missing' });

  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken.id) return res.status(401).json({ error: 'Token invalid' });

  req.user = await User.findById(decodedToken.id);

  next();
};

const unknownEndpoint = (req, res) =>
  res.status(404).send('<h2>Unknown Endpoint!</h2>');

// ---------- Error handling ----------
const errHandler = (err, req, res, next) => {
  logger.error(err.message);

  if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });
  else if (err.name === 'TypeError')
    return res.status(400).json({ error: 'Content missing' });
  else if (err.name === 'CastError')
    return res.status(400).json({ error: err.message });
  else if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key error')
  )
    return res.status(400).json({ error: 'Username must be unique' });
  else if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'Token invalid' });

  next(err);
};

export {
  reqLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errHandler,
};
