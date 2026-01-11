import { createFileRoute } from '@tanstack/react-router';
import { blogQueryOption } from '../blogQueryOptions';
import { useBlogQuery } from '../hooks/useBlogsQueries';

export const Route = createFileRoute('/blogs/$blogId')({
  loader: ({ context: { queryClient }, params: { blogId } }) => {
    return queryClient.ensureQueryData(blogQueryOption(blogId));
  },
  component: RouteComponent,
  pendingComponent: () => <h3>Loading blog info...</h3>,
});

const RouteComponent = () => {
  const blogId = Route.useParams().blogId;

  const { data: blog } = useBlogQuery(blogId);

  return (
    <>
      <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes</p>
      <p>Added by {blog.author}</p>
    </>
  );
};

// TODO: Write query options to fetch single blog view
// TODO: Implement routing for single blog view
