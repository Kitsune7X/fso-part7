import { queryOptions } from '@tanstack/react-query';
import blogService from './services/blogs';

export const blogQueryOption = (blogId) => {
  return queryOptions({
    queryKey: ['blogs', { blogId }],
    queryFn: () => blogService.getBlog(blogId),
  });
};
