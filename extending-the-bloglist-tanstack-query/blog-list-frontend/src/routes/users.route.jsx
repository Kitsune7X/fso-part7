import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Users from '../components/Users/Users';

export const Route = createFileRoute('/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: users,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/api/users');
      return response.data;
    },
  });

  if (isPending) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <span>{error.message}</span>;
  }

  // console.log(users);

  return (
    <>
      <h2>Users</h2>
      <Users users={users} />
      <Outlet />
    </>
  );
}

// TODO: Display users in a table and extract it to a separate component
