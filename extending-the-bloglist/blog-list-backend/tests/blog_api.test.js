import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import blogHelper from './test_helper.js';
import Blog from '../models/blog.js';
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Wrap the Express app in `supertest` function
const api = supertest(app);

describe('When there are initially some blogs saved', () => {
  // ---------- Initialize Test Database ----------
  beforeEach(async () => {
    await Blog.deleteMany({});

    await Blog.insertMany(blogHelper.initialBlogs);
  });

  // ---------- Test correct Content type ----------
  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  // ---------- Test all blogs are returned ----------
  test('All blogs are returned', async () => {
    const blogs = await api.get('/api/blogs');

    assert.strictEqual(blogs.body.length, blogHelper.initialBlogs.length);
  });

  // ---------- Test for specific blog ----------
  test('A specific blog is within returned blogs', async () => {
    const blogs = await api.get('/api/blogs');

    const blogTitles = blogs.body.map((z) => z.title);

    assert.strictEqual(blogTitles[0], "Never Give Up: Cena's Mentality");
  });

  // ---------- Test to verify that unique identifier is named `id`  ----------
  test('Unique identifier property of blog post is named id', async () => {
    // Get all the blog
    const blogs = await api.get('/api/blogs');

    // Object.keys() return a array of keys. We check if each of those
    // array contain 'id'.
    const blogIdCheck = blogs.body.every((blog) =>
      Object.keys(blog).includes('id'),
    );

    assert.strictEqual(blogIdCheck, true);
  });

  describe('Viewing a specific blog', () => {
    // ---------- Test succeed case ----------
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const blogToView = blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    // ---------- Test valid id but deleted ----------
    test('fail with status 404 when blog does not exist', async () => {
      const nonExistingId = await blogHelper.nonExistingId();

      await api.get(`/api/blogs/${nonExistingId}`).expect(404);
    });

    // ---------- Test for invalid id ----------
    test('fail with status 400 when id is invalid', async () => {
      const invalidId = '23434311';

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('Post a new blog', () => {
    // ---------- Test Posting function ----------
    test('Post a new blog works', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      const newBlog = {
        title: 'Rise of the Apex Predator',
        author: 'Randy Orton',
        url: 'https://wwe.com/articles/orton-apex',
        likes: 9,
        user: userToTest.id,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await blogHelper.blogsInDb();

      // Check if the length of the new array === initialBlogs + 1
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      // Check if the posted Blog is the same as `newBlog`
      const titles = blogsAtEnd.map((blog) => blog.title);

      assert.strictEqual(titles.includes(newBlog.title), true);
    });

    // ---------- Test for when token is not provided ----------
    test('fail with status 401 when token is not provided', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const newBlog = {
        title: 'Rise of the Apex Predator',
        author: 'Randy Orton',
        url: 'https://wwe.com/articles/orton-apex',
        likes: 9,
        user: userToTest.id,
      };

      const result = await api.post('/api/blogs').send(newBlog).expect(401);

      const blogsAtEnd = await blogHelper.blogsInDb();

      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);

      assert(result.body.error.includes('Token missing'));
    });

    // ---------- Test for invalid blog post ----------
    test('Blog with empty body will not be added', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const blogWithoutBody = {};

      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutBody)
        .expect(400);

      // Verify that the amount of blogs does not change
      const blogsAtEnd = await Blog.find({});

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    // ---------- Test for missing `likes` property ----------
    // If the `likes` property is missing from `req`, default to 0
    test('When "Likes" is missing, default to 0', async () => {
      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      const blogWithoutLikes = {
        title: "The Game's Evolution",
        author: 'Triple H',
        url: 'https://wwe.com/articles/triple-h-evolution',
        user: userToTest.id,
      };

      // Test if the blog is successfully posted first
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      // Check if the likes is 0
      const addedBlog = (await Blog.find({})).at(-1);
      assert.strictEqual(addedBlog.likes, 0);
    });

    // ---------- Test for missing `Title` ----------
    test('Blog without "Title" will not be added', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      const blogWithoutTitle = {
        author: 'The Undertaker',
        url: 'https://wwe.com/articles/undertaker-aura',
        likes: 31,
        user: userToTest.id,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400);

      // Verify that the amount of blogs does not change
      const blogsAtEnd = await Blog.find({});

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    // ---------- Test for missing Author ----------
    test('Blog without "Author" will not be added', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
        user: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      const blogWithoutAuthor = {
        title: "The Deadman's Aura",
        url: 'https://wwe.com/articles/undertaker-aura',
        likes: 31,
        user: userToTest.id,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutAuthor)
        .expect(400);

      const blogsAtEnd = await Blog.find({});

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    // ---------- Test for missing Url ----------
    test('Blog without "Url" will not be added', async () => {
      const blogsAtStart = await blogHelper.blogsInDb();

      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
        user: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      const blogWithoutUrl = {
        title: "The Deadman's Aura",
        author: 'The Undertaker',
        likes: 31,
        user: userToTest.id,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400);

      const blogsAtEnd = await Blog.find({});

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });
  });

  describe('Delete a blog', () => {
    // ---------- Test when id is valid ----------
    test('When the id is valid, delete the blog', async () => {
      const blogsAtStart = await Blog.find({});
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
    });

    // ---------- Test for non existent Blog ----------
    test('Fail with status 400 when id is valid but blog does not exist', async () => {
      const nonExistingId = await blogHelper.nonExistingId();

      await api.delete(`/api/blogs/${nonExistingId}`).expect(400);
    });

    // ---------- Test for invalid id ----------
    test('Fail with status 400 when id is invalid', async () => {
      const invalidId = '2321313';

      await api.delete(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe('Update a blog', () => {
    // ---------- Test for update when id is valid ----------
    test('When the id and content is valid, update the blog', async () => {
      const users = await blogHelper.userInDb();
      const userToTest = users[0];

      const dataForToken = {
        username: userToTest.username,
        id: userToTest.id,
      };

      const token = jwt.sign(dataForToken, process.env.SECRET);

      const blogsAtStart = await blogHelper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const updateLikes = { likes: 100 };

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      // Test that the updated Blog has the correct amount of likes
      assert.strictEqual(updatedBlog.body.likes, updateLikes.likes);
    });

    // ---------- Test for when id is valid but content is non existent ----------
    test('Fail with status 400 when id is valid but content is non existent', async () => {
      const nonExistingId = blogHelper.nonExistingId();
      const tempLikes = { likes: 100 };

      await api.put(`/api/blogs/${nonExistingId}`).send(tempLikes).expect(400);
    });

    // ---------- Test for when id is invalid ----------
    test('Fail with status 400 when id is invalid', async () => {
      const invalidId = '23254523';
      const tempLikes = { likes: 100 };

      await api.put(`/api/blogs/${invalidId}`).send(tempLikes).expect(400);
    });
  });

  // Test for creating user
  describe('When there are some user in DB', () => {
    beforeEach(async () => {
      await User.deleteMany({});

      const passwordHash = await bcrypt.hash('secret', 10);

      const user = new User({ username: 'root', passwordHash });

      await user.save();
    });

    // ---------- Test creation succeed ----------
    test('creation succeed with a fresh username', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        username: 'Fox-kun',
        name: 'Fox',
        password: 'foxvillage',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const userAtEnd = await blogHelper.userInDb();

      assert.strictEqual(userAtEnd.length, userAtStart.length + 1);

      const usernames = userAtEnd.map((user) => user.username);

      assert(usernames.includes(newUser.username));
    });

    // ---------- Test for unique username ----------
    test('fails with status 400 when there is already an existing username', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        username: 'root',
        password: 'foxvillage',
      };

      const result = await api.post('/api/users').send(newUser).expect(400);

      const userAtEnd = await blogHelper.userInDb();

      assert.strictEqual(userAtStart.length, userAtEnd.length);
      assert(result.body.error.includes('Username must be unique'));
    });

    // ---------- Test for username missing ----------
    test('fails with status 400 when username is not present', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        name: 'Gold Fish',
        password: 'aqua',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const userAtEnd = await blogHelper.userInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);

      assert(result.body.error.includes('Username missing'));
    });

    // ---------- Test for username less than min length  ----------
    test('fails with status 400 when username is less than 3 characters', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        username: 'Fi',
        name: 'Gold Fish',
        password: 'aqua',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const userAtEnd = await blogHelper.userInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);

      assert(result.body.error.includes('Minimum 3 characters'));
    });

    // ---------- Test for password missing ----------
    test('fails with status 400 when password is missing', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        username: 'Fish',
        name: 'Gold Fish',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const userAtEnd = await blogHelper.userInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);

      assert(result.body.error.includes('Password missing'));
    });

    // ---------- Test for password not long enough ----------
    test('fails with status 400 when password length is less than 3 characters', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        username: 'Fish',
        name: 'Gold Fish',
        password: 'aq',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const userAtEnd = await blogHelper.userInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);

      assert(
        result.body.error.includes('Minimum password length: 3 characters'),
      );
    });

    // ---------- Test for no name ----------
    test('default to `no name` when no name is given', async () => {
      const userAtStart = await blogHelper.userInDb();

      const newUser = {
        username: 'Fish',
        password: 'aqua',
      };

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const userAtEnd = await blogHelper.userInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length + 1);

      const names = userAtEnd.map((user) => user.name);
      assert(names.includes('no name'));
    });
  });
});

// ---------- Close the connection ----------
// Note: Need to close the connection after test otherwise it would hang
after(async () => {
  await mongoose.connection.close();
});
