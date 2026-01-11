// https://vite.dev/guide/features#css-modules
import styles from './Blog.module.css';
import { Link } from '@tanstack/react-router';

const Blog = ({ blog }) => {
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
      </div>
    </div>
  );
};

export default Blog;
