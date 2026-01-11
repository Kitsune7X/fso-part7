import { useRef } from 'react';
import Blog from './components/Blog/Blog';
import BlogEditor from './components/BlogEditor/BlogEditor';
import VisibilityToggle from './components/VisibilityToggle/VisibilityToggle';

import { useUserContext } from './UserContext';

import { useDisplayNotification } from './hooks/useDisplayNotification';

import {
  useBlogsQuery,
  useCreateBlog,
  useDeleteBlog,
} from './hooks/useBlogsQueries';

// ---------- Theming ----------
import { Box, Typography } from '@mui/material';

const App = () => {
  const user = useUserContext();

  const displayNotification = useDisplayNotification();

  const blogFormRef = useRef(null);

  // Query for blogs with useBlogsQuery custom hook
  const {
    data: blogs,
    isPending: blogQueryPending,
    isError: blogQueryIsError,
    error: blogQueryError,
  } = useBlogsQuery();

  const blogMutation = useCreateBlog();

  const blogDelete = useDeleteBlog();

  if (blogQueryPending) {
    return <h1>Loading...</h1>;
  }

  if (blogQueryIsError) {
    return <span>Error: {blogQueryError?.message}</span>;
  }

  // ---------- Handle Add Blog ----------
  // Use Tanstack query to handle adding blog
  const handleAddBlog = (newBlog) => {
    //https://tkdodo.eu/blog/mastering-mutations-in-react-query
    // Get the newly added Blog through call back function on `mutate`
    blogMutation.mutate(newBlog, {
      onSuccess: (addedBlog) => {
        displayNotification(
          `A new blog ${addedBlog?.title} by ${addedBlog?.author} is added`,
        );
      },
      onError: (error) => {
        displayNotification(`${error?.message}`, true);
      },
    });

    blogFormRef.current.toggleChildrenVisibility();
  };

  // ---------- Blogs ----------
  const blogDisplay = () => (
    <Box sx={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <Typography variant="h2" marginBottom={2}>
        Blogs
      </Typography>
      <Box
        id="blog-container"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        {blogs
          ?.sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
      </Box>
    </Box>
  );

  return (
    <div>
      {user && (
        <>
          <VisibilityToggle buttonLabel="Create new Blog" ref={blogFormRef}>
            <BlogEditor createBlog={handleAddBlog} />
          </VisibilityToggle>
          {blogDisplay()}
        </>
      )}
    </div>
  );
};

export default App;
