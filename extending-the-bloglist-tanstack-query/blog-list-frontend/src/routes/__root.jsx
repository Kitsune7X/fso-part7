import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useNotificationContext } from '../notificationContext';
import { useUserContext } from '../UserContext';
import Notification from '../components/Notification/Notification';

const RootLayout = () => {
  const notification = useNotificationContext();
  const user = useUserContext();

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

      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });

// TODO: Extract `loginForm`, `handleLogout` to custom Hook to be used in the root route
// TODO: Display blog list at root route (Index)
