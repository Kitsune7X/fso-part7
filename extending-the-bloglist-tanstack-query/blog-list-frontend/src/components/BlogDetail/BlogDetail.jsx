import {
  useLikeBlog,
  useDeleteBlog,
  useAddBlogComment,
  useDeleteBlogComment,
} from '../../hooks/useBlogsQueries';
import { useDisplayNotification } from '../../hooks/useDisplayNotification';
import { useFormInput } from '../../hooks/useFormInput';

import { Card, CardContent, Typography, Button, Box } from '@mui/material';

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
    <Card sx={{ p: 4 }}>
      <CardContent>
        <Typography variant="h5">{blog.title}</Typography>
        <a href="#">{blog.url}</a>
        <div>
          <span>{blog.likes} Likes</span>
          <Button onClick={addLike} type="button">
            Likes
          </Button>
          {blog?.user && (
            <Button
              onClick={() => {
                window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
                  ? handleDeleteBlog()
                  : displayNotification('No changes have been made');
              }}
              type="button"
            >
              Delete Blog
            </Button>
          )}
        </div>
        <p>Added by {blog.author}</p>
        <h3>Comments</h3>
        <Box
          component="form"
          onSubmit={handleAddComment}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <input {...commentProps} style={{ width: '100%' }} />
          <Button type="submit">Add comment</Button>
        </Box>

        <ul>
          {blog.comments.map((c) => (
            <li key={c._id}>
              {c.comment}{' '}
              <Button type="button" onClick={() => handleDeleteComment(c._id)}>
                Delete comment
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default BlogDetail;
