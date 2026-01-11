import { createFileRoute } from '@tanstack/react-router';
import Users from '../components/Users/Users';
import { useUsersQuery } from '../hooks/useUsersQueries';

export const Route = createFileRoute('/users/')({
  component: UsersList,
});

const UsersList = () => {
  const { data: users, isPending, isError, error } = useUsersQuery();

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
