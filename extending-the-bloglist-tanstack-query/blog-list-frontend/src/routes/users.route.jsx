import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Users from '../components/Users/Users';

export const Route = createFileRoute('/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}

// TODO: Display users in a table and extract it to a separate component
