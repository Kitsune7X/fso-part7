import { createFileRoute } from '@tanstack/react-router';
import { blogQueryOption } from '../blogQueryOptions';
import { useBlogQuery } from '../hooks/useBlogsQueries';
import BlogDetail from '../components/BlogDetail/BlogDetail';

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

  // console.log(blog);

  return (
    <>
      <BlogDetail blog={blog} />
    </>
  );
};
