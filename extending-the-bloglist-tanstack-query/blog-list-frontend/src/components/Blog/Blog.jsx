import { useState } from 'react';
// https://vite.dev/guide/features#css-modules
import styles from './Blog.module.css';
import blogService from '../../services/blogs';

const Blog = ({ blog, setError, displayNotification, handleDeleteBlog }) => {
  const [moreDetail, setMoreDetail] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  // ---------- Add Likes ----------
  const addLikes = async () => {
    // console.log(`${blog.id}`);
    const newLikes = likes + 1;

    const stuffToUpdate = {
      user: blog.user.id,
      likes: newLikes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    // console.log(stuffToUpdate);
    try {
      const result = await blogService.update(stuffToUpdate, blog.id);
      // console.log(result);
      setLikes(result.likes);
    } catch (error) {
      console.log(error.response.data.error);

      setError({ type: 'SET_ERROR' });
      displayNotification(`${error.response.data.error}`);
    }
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
            <span data-testid="likes-count">Likes: {likes}</span>
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
