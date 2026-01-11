import { createFileRoute } from '@tanstack/react-router';
import { userQueryOptions } from '../userQueryOptions';
import { useUserQuery } from '../hooks/useUsersQueries';

export const Route = createFileRoute('/users/$userId')({
  // Use the `loader` option to ensure that the data is loaded
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(userQueryOptions(userId));
  },
  component: User,
  pendingComponent: () => <h3>Loading user info...</h3>,
});

const User = () => {
  const userId = Route.useParams().userId;
  // Read the data from cache and subscribe to update
  const { data: user } = useUserQuery(userId);

  return (
    <>
      <h2>{user.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </>
  );
};
