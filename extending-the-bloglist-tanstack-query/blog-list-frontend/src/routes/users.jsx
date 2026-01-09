import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const Route = createFileRoute('/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: users, isPending } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get('/api/users');
      return response.data;
    },
  });

  if (isPending) {
    return <h2>Loading...</h2>;
  }

  console.log(users);

  return (
    <>
      <h2>Users</h2>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} {user.blogs.length}
        </li>
      ))}
    </>
  );
}
