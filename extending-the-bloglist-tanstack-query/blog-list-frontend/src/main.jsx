import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import { NotificationContextProvider } from './NotificationContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserContextProvider } from './UserContextProvider';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// Create a client
const queryClient = new QueryClient();

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree });

ReactDOM.createRoot(document.getElementById('root')).render(
  // Provide the Client for the app
  <StrictMode>
    <RouterProvider router={router}>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </RouterProvider>
  </StrictMode>,
);
