import { useState, useEffect, useRef, useContext } from 'react';
import Blog from './components/Blog/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification/Notification';
import BlogEditor from './components/BlogEditor/BlogEditor';
import VisibilityToggle from './components/VisibilityToggle/VisibilityToggle';
import {
  useNotificationContext,
  useNotificationDispatchContext,
} from './notificationContext';

// TODO: Use `useReducer` and context to manage the notification data

// TODO: Refactor code, combining notification and error in one reducer
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const notification = useNotificationContext();
  const dispatchNotification = useNotificationDispatchContext();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // If the user is logged in, set user so that user stay logged in
  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedInUser'));

    // console.log(user);

    if (user) {
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef(null);

  // ---------- Display Notification ----------

  const displayNotification = (message, isError = false) => {
    dispatchNotification({
      type: 'DISPLAY_NOTIFICATION',
      payload: {
        message,
        isError,
      },
    });
    setTimeout(() => {
      dispatchNotification({ type: 'CLEAR_NOTIFICATION' });
    }, 5000);
  };

  // ---------- Handle Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username: username.trim(),
        password: password.trim(),
      });

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      setUser(user);
      displayNotification('You have successfully logged in');
      blogService.setToken(user.token);
      setUsername('');
      setPassword('');
    } catch {
      displayNotification('Wrong username or password', true);
    }
  };

  // ---------- Handle Logout ----------
  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');

    displayNotification('You have successfully logged out');

    setUser(null);
  };

  // ---------- Handle Add Blog ----------
  const handleAddBlog = async (newBlog) => {
    // console.log(newBlog);
    try {
      const addedBlog = await blogService.create(newBlog);

      // console.log(addedBlog);

      displayNotification(
        `A new blog ${addedBlog.title} by ${addedBlog.author} is added`,
      );

      blogFormRef.current.toggleChildrenVisibility();

      setBlogs([...blogs, addedBlog]);
    } catch (error) {
      console.log(error.response.data.error);

      displayNotification(`${error.response.data.error}`, true);
    }
  };

  // ---------- Delete Blog ----------
  const handleDeleteBlog = async (blogToDelete) => {
    try {
      const deletedBlog = await blogService.remove(blogToDelete.id);

      // console.log(removedBlog);
      displayNotification(`${deletedBlog.title} has been deleted`);

      setBlogs(blogs.filter((blog) => blog.id !== deletedBlog.id));
    } catch (error) {
      console.log(error.response.data.error);

      displayNotification(`${error.response.data.error}`, true);
    }
  };

  // ---------- Login Form ----------
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>

      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  );

  // ---------- Blogs ----------
  const blogDisplay = () => (
    <div>
      <h2>Blogs</h2>
      <div id="blog-container">
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              displayNotification={displayNotification}
              handleDeleteBlog={handleDeleteBlog}
            />
          ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1>Blog App</h1>
      {notification.message && <Notification />}
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} is logged in.</p>
          <button onClick={handleLogout}>logout</button>
          <VisibilityToggle buttonLabel="Create new Blog" ref={blogFormRef}>
            <BlogEditor createBlog={handleAddBlog} />
          </VisibilityToggle>
          {blogDisplay()}
        </div>
      )}
    </div>
  );
};

export default App;
