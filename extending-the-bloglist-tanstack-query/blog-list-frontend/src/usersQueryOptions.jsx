import { queryOptions } from '@tanstack/react-query';
import userService from './services/users';

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: () => userService.getAll(),
});
