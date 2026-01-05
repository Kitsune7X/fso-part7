import express from 'express';
import User from '../models/user.js';
import Blog from '../models/blog.js';
import blogHelper from '../tests/test_helper.js';

const { initialBlogs } = blogHelper;

const testingRouter = express.Router();

// Delete all data in Database
testingRouter.post('/reset', async (req, res) => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);

  res.status(204).end();
});

export default testingRouter;
