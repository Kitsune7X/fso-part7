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

  console.log(blog);

  return (
    <>
      {/* <h2>{blog.title}</h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        <span>{blog.likes} likes</span>
        <button></button>
      </div>
      <p>Added by {blog.author}</p> */}
      <BlogDetail blog={blog} />
    </>
  );
};

// TODO: Write query options to fetch single blog view
// TODO: Implement routing for single blog view
// TODO: Extract blog component
