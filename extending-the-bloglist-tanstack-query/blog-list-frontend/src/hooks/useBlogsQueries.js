import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import blogService from '../services/blogs';
import { blogsQueryOptions } from '../blogsQueryOptions';
import { blogQueryOption } from '../blogQueryOptions';
import { useNavigate } from '@tanstack/react-router';

export const useBlogsQuery = () => {
  return useQuery(blogsQueryOptions);
};

export const useBlogQuery = (blogId) => {
  return useSuspenseQuery(blogQueryOption(blogId));
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
      // Update the cache for the single blog since the blogs list
      // does not need to display the likes anymore
      queryClient.setQueryData(
        ['blogs', { blogId: updatedBlog.id }],
        updatedBlog,
      );

      // queryClient.setQueryData(['blogs'], (oldData) =>
      //   oldData.map((b) =>
      //     b.id === updatedBlog.id ? { ...b, likes: updatedBlog.likes } : b,
      //   ),
      // );
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id }) => blogService.remove(id),
    onSuccess: (deletedBlog) => {
      navigate({ to: '/blogs' });
      queryClient.setQueryData(['blogs'], (oldData) =>
        oldData.filter((b) => b.id !== deletedBlog.id),
      );
    },
    onError: (error) => console.log(error.message),
  });
};

export const useAddBlogComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ comment, id }) => blogService.addComment(comment, id),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(
        ['blogs', { blogId: updatedBlog.id }],
        updatedBlog,
      );
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
};

export const useDeleteBlogComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogId, commentId }) =>
      blogService.deleteComment(blogId, commentId),
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(
        ['blogs', { blogId: updatedBlog.id }],
        updatedBlog,
      );
    },
    onError: (error) => console.log(error.message),
  });
};
