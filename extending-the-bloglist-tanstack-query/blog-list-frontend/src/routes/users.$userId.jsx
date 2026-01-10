import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';

export const Route = createFileRoute('/users/$userId')({
  // Use the `loader` option to ensure that the data is loaded
  loader: ({ context: { queryClient }, params: { userId } }) => {
    return queryClient.ensureQueryData(
      queryOptions({
        queryKey: ['users', { userId }],
        queryFn: async () => {
          const response = await axios.get(`/api/users/${userId}`);

          return response.data;
        },
      }),
    );
  },
  component: User,
});

const User = () => {
  const userId = Route.useParams().userId;
  // Read the data from cache and subscribe to update
  const { data: user } = useSuspenseQuery(
    queryOptions({
      queryKey: ['users', { userId }],
      queryFn: async () => {
        const response = await axios.get(`/api/users/${userId}`);

        return response.data;
      },
    }),
  );

  return (
    <>
      <h2>{user?.name}</h2>
      <h3>Added blogs</h3>
      <ul>
        {user?.blogs?.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </>
  );
};

// TODO: Extract queryOptions and write user service for fetching user data
