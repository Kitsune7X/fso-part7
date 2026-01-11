import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import userService from './services/users';

export const userQueryOptions = (userId) => {
  return queryOptions({
    queryKey: ['users', { userId }],
    queryFn: () => userService.getUser(userId),
  });
};
