import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useNotificationContext } from '../notificationContext';
import { useUserContext, useUserContextDispatch } from '../UserContext';
import Notification from '../components/Notification/Notification';
import { useEffect } from 'react';
import blogService from '../services/blogs';
import loginService from '../services/login';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { useDisplayNotification } from '../hooks/useDisplayNotification';
import { useFormInput } from '../hooks/useFormInput';

// Material UI imports
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link as MuiLink, Breadcrumbs, Button, TextField } from '@mui/material';

// Variable to make sure useEffect only run once to check for existing user
// https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
let didInit = false;

const RootLayout = () => {
  // Use custom hook for input and pull a property off the object with
  // destructure and spread
  const usernameInput = useFormInput('text');
  const { resetValue: resetUsername, ...usernameProps } = usernameInput;

  const passwordInput = useFormInput('password');
  const { resetValue: resetPassword, ...passwordProps } = passwordInput;

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
        username: usernameProps.value.trim(),
        password: passwordProps.value.trim(),
      });

      // console.log(user);

      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      dispatchUser({
        type: 'SET_USER',
        payload: user,
      });
      displayNotification('You have successfully logged in');
      blogService.setToken(user.token);
      resetUsername();
      resetPassword();
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
  const loginForm = () => (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        alignItems: 'flex-start',
      }}
    >
      <Typography variant="h3">Log in to application</Typography>

      <TextField
        slotProps={{
          htmlInput: {
            type: 'text',
            value: usernameProps.value,
            onChange: usernameProps.onChange,
          },
        }}
        label="Username"
      />

      <TextField
        slotProps={{
          htmlInput: {
            type: 'password',
            value: passwordProps.value,
            onChange: passwordProps.onChange,
          },
        }}
        label="Password"
      />

      <Button type="submit" variant="contained">
        Login
      </Button>
    </Box>
  );

  // ---------- Theming ----------
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline enableColorScheme />
        <Container maxWidth="md">
          <Box sx={{ p: 2 }}>
            <Typography variant="h1" sx={{ marginBottom: 4 }}>
              BLOGS APP
            </Typography>
            {user && (
              <div>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link to="/" style={{ textDecoration: 'none' }}>
                    <MuiLink
                      underline="hover"
                      color="inherit"
                      sx={{ fontSize: 20 }}
                    >
                      Home
                    </MuiLink>
                  </Link>
                  <Link to="/users" style={{ textDecoration: 'none' }}>
                    <MuiLink
                      underline="hover"
                      color="inherit"
                      sx={{ fontSize: 20 }}
                    >
                      Users
                    </MuiLink>
                  </Link>
                  {user && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body1">
                        "{user.name}" is logged in.
                      </Typography>
                      <Button variant="outlined" onClick={handleLogout}>
                        Log out
                      </Button>
                    </Box>
                  )}
                </Breadcrumbs>
                <hr />
              </div>
            )}
          </Box>
          {notification.message && <Notification />}
          {!user && loginForm()}

          {user && <Outlet />}
          <ReactQueryDevtools buttonPosition="top-right" />
          <TanStackRouterDevtools />
        </Container>
      </ThemeProvider>
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
