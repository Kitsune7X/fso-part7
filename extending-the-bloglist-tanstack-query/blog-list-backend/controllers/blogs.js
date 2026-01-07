import express from 'express';
import Blog from '../models/blog.js';
import logger from '../utils/logger.js';
import { userExtractor } from '../utils/middleware.js';
// Use the express.Router class to create modular,
// mountable route handlers. A Router instance is a
// complete middleware and routing system;
// for this reason, it is often referred to as a “mini-app”.
// https://expressjs.com/en/guide/routing.html
const blogRouter = express.Router();

// Middleware that is specific to this route :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// ---------- Time log ----------
const timeLog = (req, res, next) => {
  logger.info('Time: ', new Date().toString());
  next();
};

blogRouter.use(timeLog);

// ---------- User check  ----------
const requireUser = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'User not found' });

  next();
};

// Route handling :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// ---------- Get all blogs ----------
blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });

  res.json(blogs);
});

// ---------- Add new blog ----------
blogRouter.post('/', userExtractor, requireUser, async (req, res) => {
  const body = req.body;

  const user = req.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  // console.log(savedBlog);

  await savedBlog.populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  console.log(savedBlog.toJSON());

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();

  res.status(201).json(savedBlog);
});

// ---------- View single blog ----------
blogRouter.get('/:id', async (req, res) => {
  const id = req.params.id;

  const blog = await Blog.findById(id);
  console.log(blog);

  if (!blog) {
    res.status(404).json({ error: 'Non exist blog' });
  } else res.status(200).json(blog);
});

// ---------- Delete a single blog ----------
blogRouter.delete('/:id', userExtractor, requireUser, async (req, res) => {
  const id = req.params.id;

  const user = req.user;

  const blogToDelete = await Blog.findById(id);

  if (!blogToDelete) return res.status(400).end();

  if (blogToDelete.user.toString() === user._id.toString()) {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    user.blogs = user.blogs.filter(
      (blog) => blog.toString() !== blogToDelete._id.toString(),
    );

    await user.save();
    return res.status(200).json(deletedBlog);
  }

  return res.status(400).end();
});

// ---------- Update a single blog ----------
blogRouter.put('/:id', userExtractor, requireUser, async (req, res) => {
  const id = req.params.id;

  const user = req.user;

  const blogToUpdate = await Blog.findById(id);

  if (!blogToUpdate) return res.status(400).end();

  if (blogToUpdate.user.toString() === user._id.toString()) {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogToUpdate._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    // console.log('Update succeeded');
    console.log(updatedBlog);

    return res.status(200).json(updatedBlog);
  }

  return res.status(400).end();
});

export default blogRouter;
