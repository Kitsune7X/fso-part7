import { useLikeBlog, useDeleteBlog } from '../../hooks/useBlogsQueries';
import { useDisplayNotification } from '../../hooks/useDisplayNotification';

const BlogDetail = ({ blog }) => {
  const blogLikeMutation = useLikeBlog();
  const blogDeleteMutation = useDeleteBlog();

  const displayNotification = useDisplayNotification();

  const addLike = () => {
    blogLikeMutation.mutate(
      {
        blog: { ...blog, likes: blog.likes + 1 },
        id: blog.id,
      },
      {
        onError: (error) => {
          console.log(error.message);
          displayNotification(error.message, true);
        },
      },
    );
  };

  const handleDeleteBlog = () => {
    blogDeleteMutation.mutate(
      {
        id: blog.id,
      },
      {
        onSuccess: (deletedBlog) => {
          displayNotification(`"${deletedBlog.title}" has been deleted`);
        },
        onError: (error) => {
          displayNotification(error.message, true);
        },
      },
    );
  };

  return (
    <>
      <h2>{blog.title}</h2>
      <a href="#">{blog.url}</a>
      <div>
        <span>{blog.likes}</span>
        <button onClick={addLike} type="button">
          Likes
        </button>
        {blog?.user && (
          <button
            onClick={() => {
              window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
                ? handleDeleteBlog()
                : displayNotification('No changes have been made');
            }}
            type="button"
          >
            Remove
          </button>
        )}
      </div>
      <p>Added by {blog.author}</p>
      <h3>Comments</h3>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </>
  );
};

export default BlogDetail;
