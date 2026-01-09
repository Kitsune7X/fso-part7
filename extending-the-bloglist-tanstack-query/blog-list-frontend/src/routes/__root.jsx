import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useNotificationContext } from '../notificationContext';
import { useUserContext, useUserContextDispatch } from '../UserContext';
import Notification from '../components/Notification/Notification';
import { useState, useEffect } from 'react';
import blogService from '../services/blogs';
import loginService from '../services/login';

import { useDisplayNotification } from '../../hooks/useDisplayNotification';

// Variable to make sure useEffect only run once to check for existing user
// https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let didInit = false;

const RootLayout = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Use Custom hook for notification
  const notification = useNotificationContext();
  const displayNotification = useDisplayNotification();

  // Use Custom hook for managing user
  const user = useUserContext();
  const dispatchUser = useUserContextDispatch();

  // If the user is logged in, set user so that user stay logged in
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      const user = JSON.parse(window.localStorage.getItem('loggedInUser'));
      // console.log(user);

      if (user) {
        dispatchUser({
          type: 'SET_USER',
          payload: user,
        });
        blogService.setToken(user.token);
      }
    }
  }, [dispatchUser]);

  // TODO: Rewrite login using Tanstack query
  // ---------- Handle Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username: username.trim(),
        password: password.trim(),
      });

      // console.log(user);

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      dispatchUser({
        type: 'SET_USER',
        payload: user,
      });
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

    dispatchUser({
      type: 'CLEAR_USER',
    });
  };

  // ---------- Login Form ----------
  // TODO: Rewrite input with custom hook
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

  return (
    <>
      <div>
        <h1>Blog App</h1>

        <Link to="/">Home</Link>
        <Link to="/app">App</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </div>
      <hr />
      {notification.message && <Notification />}
      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.name} is logged in.</p>
          <button onClick={handleLogout}>logout</button>
        </div>
      )}
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });

// TODO: Extract `loginForm`, `handleLogout` to custom Hook to be used in the root route
// TODO: Display blog list at root route (Index)
