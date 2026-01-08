import { createFileRoute, Outlet } from '@tanstack/react-router';
import App from '../App';

export const Route = createFileRoute('/app')({
  component: AppRouteComponent,
});

const AppRouteComponent = () => {
  return (
    <>
      <App />
      <Outlet />
    </>
  );
};
