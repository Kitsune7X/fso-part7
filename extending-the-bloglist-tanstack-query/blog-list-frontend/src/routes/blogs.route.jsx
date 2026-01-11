import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/blogs')({
  component: RouteComponent,
});

const RouteComponent = () => {
  return <Outlet />;
};
