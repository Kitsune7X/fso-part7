import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Users from '../components/Users/Users';

export const Route = createFileRoute('/users/')({
  component: UsersList,
});

const UsersList = () => {
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

  return (
    <>
      <h2>Users</h2>
      <Users users={users} />
    </>
  );
};
