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
    },
  });
};

export const useLikeBlog = () => {
  const queryClient = useQueryClient();

  // https://tkdodo.eu/blog/mastering-mutations-in-react-query#mutations-only-take-one-argument-for-variables
  // Mutation only take one argument
  return useMutation({
    mutationFn: ({ blog, id }) => blogService.update(blog, id),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(['blogs'], (oldData) =>
        oldData.map((b) =>
          b.id === updatedBlog.id ? { ...b, likes: updatedBlog.likes } : b,
        ),
      );
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }) => blogService.remove(id),
    onSuccess: (deletedBlog) => {
      queryClient.setQueryData(['blogs'], (oldData) =>
        oldData.filter((b) => b.id !== deletedBlog.id),
      );
    },
    onError: (error) => console.log(error),
  });
};
