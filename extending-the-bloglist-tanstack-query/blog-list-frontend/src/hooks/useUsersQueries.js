import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { usersQueryOptions } from '../usersQueryOptions';
import { userQueryOptions } from '../userQueryOptions';

export const useUsersQuery = () => {
  return useQuery(usersQueryOptions);
};

export const useUserQuery = (userId) => {
  return useSuspenseQuery(userQueryOptions(userId));
};
