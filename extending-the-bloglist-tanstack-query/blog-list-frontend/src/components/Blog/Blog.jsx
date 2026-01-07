import { useState } from 'react';
// https://vite.dev/guide/features#css-modules
import styles from './Blog.module.css';
import { useLikeBlog } from '../../hooks/useBlogsQueries';

const Blog = ({ blog, displayNotification, handleDeleteBlog }) => {
  const [moreDetail, setMoreDetail] = useState(false);

  const blogLikeMutation = useLikeBlog();

  // ---------- Add Likes ----------
  const addLikes = () => {
    const stuffToUpdate = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    blogLikeMutation.mutate(
      { blog: stuffToUpdate, id: blog.id },
      {
        onError: (error) => {
          displayNotification(error.message, true);
        },
      },
    );
  };

  return (
    <div className={styles.blog}>
      <div>
        <span>
          {blog.title} {blog.author}
        </span>
        <button
          onClick={() => setMoreDetail(!moreDetail)}
          type="button"
          data-testid="detail-btn"
        >
          {moreDetail ? 'Hide' : 'View'}
        </button>
      </div>

      {moreDetail && (
        <div>
          <a href="#">{blog.url}</a>
          <div>
            <span data-testid="likes-count">Likes: {blog.likes}</span>
            <button onClick={addLikes} type="button">
              Like
            </button>
          </div>
          <p>User: {blog?.user?.username}</p>
          {/* Using optional chaining in case something happen, React just render nothing
              instead of explode with errors */}
          {blog?.user && (
            <button
              onClick={() => {
                window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)
                  ? handleDeleteBlog(blog)
                  : displayNotification('No changes have been made');
              }}
              type="button"
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
