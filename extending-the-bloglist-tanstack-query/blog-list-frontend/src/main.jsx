import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { NotificationContextProvider } from './NotificationContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './UserContextProvider';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import CssBaseline from '@mui/material/CssBaseline';

// Create a client
const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance with queryClient context
// to provide queryClient for child routes
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // Provide the Client for the app
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <UserContextProvider>
          <RouterProvider router={router} />
        </UserContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
