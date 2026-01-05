import bcrypt from 'bcrypt';
import express from 'express';
import User from '../models/user.js';

const userRouter = express.Router();

// ---------- View all users ----------
userRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
  });

  res.status(200).json(users);
});

// ---------- Add new user ----------
userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) return res.status(400).json({ error: 'Password missing' });

  if (password.length < 3)
    return res
      .status(400)
      .json({ error: 'Minimum password length: 3 characters' });

  // Define Salt round
  const saltRound = 10;
  // Hash the password
  const passwordHash = await bcrypt.hash(password, saltRound);

  const user = new User({
    username,
    name: name || 'no name',
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

export default userRouter;
