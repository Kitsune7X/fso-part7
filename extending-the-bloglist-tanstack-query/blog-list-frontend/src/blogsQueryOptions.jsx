import { queryOptions } from '@tanstack/react-query';
import blogService from './services/blogs';

export const blogsQueryOptions = queryOptions({
  queryKey: ['blogs'],
  queryFn: () => blogService.getAll(),
  refetchOnWindowFocus: false,
});
