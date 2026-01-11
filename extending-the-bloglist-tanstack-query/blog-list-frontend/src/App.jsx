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

  // ---------- Delete Blog ----------
  const handleDeleteBlog = (blogToDelete) => {
    blogDelete.mutate(
      { id: blogToDelete.id },
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

  // ---------- Blogs ----------
  const blogDisplay = () => (
    <div>
      <h2>Blogs</h2>
      <div id="blog-container">
        {blogs
          ?.sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              displayNotification={displayNotification}
              handleDeleteBlog={handleDeleteBlog}
            />
          ))}
      </div>
    </div>
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

// TODO: Add Link to view single blog
