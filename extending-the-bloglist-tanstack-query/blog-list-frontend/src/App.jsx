import { useState, useEffect, useRef, useReducer } from 'react';
import Blog from './components/Blog/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification/Notification';
import BlogEditor from './components/BlogEditor/BlogEditor';
import VisibilityToggle from './components/VisibilityToggle/VisibilityToggle';
import {
  NotificationContext,
  NotificationDispatchContext,
} from './notificationContext';

// TODO: Use `useReducer` and context to manage the notification data

// TODO: Refactor code, combining notification and error in one reducer
const App = () => {
  const notificationReducer = (_state, action) => {
    switch (action.type) {
      case 'DISPLAY_NOTIFICATION': {
        return action.payload;
      }
      case 'CLEAR_NOTIFICATION': {
        return { message: null, isError: false };
      }
      default: {
        throw new Error('Unknown action: ' + action.type);
      }
    }
  };

  // const errorReducer = (_state, action) => {
  //   switch (action.type) {
  //     case 'SET_ERROR': {
  //       return true;
  //     }
  //     case 'CLEAR_ERROR': {
  //       return false;
  //     }
  //     default: {
  //       throw new Error('Unknown action: ' + action.type);
  //     }
  //   }
  // };

  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // TODO: Notification reducer now contain an object that store message and error state
  const [notification, dispatchNotification] = useReducer(notificationReducer, {
    message: null,
    isError: false,
  });

  // const [error, dispatchError] = useReducer(errorReducer, false);

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
      // dispatchError({ type: 'SET_ERROR' });

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
    <NotificationContext value={notification}>
      <NotificationDispatchContext value={dispatchNotification}>
        <div>
          <h1>Blog App</h1>
          {notification.message && (
            <Notification isError={notification.isError} />
          )}
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
      </NotificationDispatchContext>
    </NotificationContext>
  );
};

export default App;
