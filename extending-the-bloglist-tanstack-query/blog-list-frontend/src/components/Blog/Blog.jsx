import { useState } from 'react';
// https://vite.dev/guide/features#css-modules
import styles from './Blog.module.css';
import { useLikeBlog } from '../../hooks/useBlogsQueries';
import { Link } from '@tanstack/react-router';

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
        <Link
          to="/blogs/$blogId"
          params={{
            blogId: blog.id,
          }}
        >
          {blog.title} {blog.author}
        </Link>
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

          <p>User: {blog?.user?.username}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
