import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import blogService from '../services/blogs';

export const useBlogQuery = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogService.create,
    onSuccess: (addedBlog) => {
      // Update query cache directly with setQueryData
      queryClient.setQueryData(['blogs'], (oldData) => [...oldData, addedBlog]);
      return addedBlog;
    },
  });
};
