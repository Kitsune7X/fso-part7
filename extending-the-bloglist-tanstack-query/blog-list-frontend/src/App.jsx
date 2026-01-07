import { useState, useEffect, useRef } from 'react';
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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  useBlogQuery,
  useCreateBlog,
  useDeleteBlog,
} from './hooks/useBlogsQueries';

// Variable to make sure useEffect only run once to check for existing user
let didInit = false;

// TODO: Extract useQuery and useMutation to separate hooks
const App = () => {
  // Access the client provided by the `QueryClientProvider`
  const queryClient = useQueryClient();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const notification = useNotificationContext();
  const dispatchNotification = useNotificationDispatchContext();

  // If the user is logged in, set user so that user stay logged in
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      const user = JSON.parse(window.localStorage.getItem('loggedInUser'));
      // console.log(user);

      if (user) {
        setUser(user);
        blogService.setToken(user.token);
      }
    }
  }, []);

  const blogFormRef = useRef(null);

  // Query for blogs with useBlogQuery custom hook
  const {
    data: blogs,
    isPending: blogQueryPending,
    isError: blogQueryIsError,
    error: blogQueryError,
  } = useBlogQuery();

  const blogMutation = useCreateBlog();

  const blogDelete = useDeleteBlog();

  if (blogQueryPending) {
    return <h1>Loading...</h1>;
  }

  if (blogQueryIsError) {
    return <span>Error: {blogQueryError?.message}</span>;
  }

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
  // Use Tanstack query to handle adding blog
  const handleAddBlog = (newBlog) => {
    //https://tkdodo.eu/blog/mastering-mutations-in-react-query
    // Get the newly added Blog through call back function on `mutate`
    blogMutation.mutate(newBlog, {
      onSuccess: (addedBlog) => {
        displayNotification(
          `A new blog ${addedBlog?.title} by ${addedBlog?.author} is added`,
        );
      },
      onError: (error) => {
        displayNotification(`${error?.message}`, true);
      },
    });

    blogFormRef.current.toggleChildrenVisibility();
  };

  // ---------- Delete Blog ----------
  const handleDeleteBlog = (blogToDelete) => {
    blogDelete.mutate(
      { id: blogToDelete.id },
      {
        onSuccess: (deletedBlog) => {
          displayNotification(`"${deletedBlog.title}" has been deleted`);
        },
        onError: (error) => {
          displayNotification(error.message, true);
        },
      },
    );
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
          ?.sort((a, b) => b.likes - a.likes)
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
