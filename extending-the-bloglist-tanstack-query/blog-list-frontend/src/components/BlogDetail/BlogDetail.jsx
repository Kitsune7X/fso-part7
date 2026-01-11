import {
  useLikeBlog,
  useDeleteBlog,
  useAddBlogComment,
  useDeleteBlogComment,
} from '../../hooks/useBlogsQueries';
import { useDisplayNotification } from '../../hooks/useDisplayNotification';
import { useFormInput } from '../../hooks/useFormInput';

const BlogDetail = ({ blog }) => {
  const blogLikeMutation = useLikeBlog();
  const blogDeleteMutation = useDeleteBlog();

  const blogAddCommentMutation = useAddBlogComment();
  const blogDeleteCommentMutation = useDeleteBlogComment();

  const commentInput = useFormInput('text');
  const { resetValue: resetComment, ...commentProps } = commentInput;

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

  const handleAddComment = (e) => {
    e.preventDefault();

    const comment = { comment: commentProps.value };

    // Mutate the blogs `comments` array with useMutation
    blogAddCommentMutation.mutate(
      { comment, id: blog.id },
      {
        onSuccess: () => {
          resetComment();
          displayNotification('Comment added');
        },
        onError: (error) => {
          displayNotification(error.message, true);
        },
      },
    );
  };

  const handleDeleteComment = (commentId) => {
    blogDeleteCommentMutation.mutate(
      { blogId: blog.id, commentId },
      {
        onSuccess: () => displayNotification('Comment deleted'),
        onError: (error) => displayNotification(error.message, true),
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
            Delete Blog
          </button>
        )}
      </div>
      <p>Added by {blog.author}</p>
      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <input {...commentProps} />
        <button type="submit">Add comment</button>
      </form>

      <ul>
        {blog.comments.map((c) => (
          <li key={c._id}>
            {c.comment}{' '}
            <button type="button" onClick={() => handleDeleteComment(c._id)}>
              Delete comment
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default BlogDetail;

// TODO: Add `Add Comment` and `Delete comment` functionality
