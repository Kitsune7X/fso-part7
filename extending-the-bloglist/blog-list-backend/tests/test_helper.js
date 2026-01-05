import Blog from '../models/blog.js';
import User from '../models/user.js';

// Dummy data
const initialBlogs = [
  {
    title: "Never Give Up: Cena's Mentality",
    author: 'John Cena',
    url: 'https://wwe.com/articles/cena-mentality',
    likes: 15,
  },
  {
    title: 'Lucha Libre Heart',
    author: 'Rey Mysterio',
    url: 'https://wwe.com/articles/rey-heart',
    likes: 11,
  },
];

const nonExistingId = async () => {
  const tempBlog = new Blog({
    title: 'Temp',
    author: 'Temp',
    url: 'Temp',
  });

  await tempBlog.save();

  await tempBlog.deleteOne();

  return tempBlog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  // Reformat the resolved value to custom `toJSON` set in `blogSchema`
  return blogs.map((blog) => blog.toJSON());
};

const userInDb = async () => {
  const users = await User.find({});

  return users.map((user) => user.toJSON());
};

export default { initialBlogs, nonExistingId, blogsInDb, userInDb };
