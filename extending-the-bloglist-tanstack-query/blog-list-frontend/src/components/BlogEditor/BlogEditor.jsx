import { useState } from 'react';
import Input from './Input/Input';
import Button from '@mui/material/Button';

import { Box, Typography } from '@mui/material';

// https://medium.com/@ozhanli/passing-data-from-child-to-parent-components-in-react-e347ea60b1bb
const BlogEditor = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const newBlog = {
    title: title.trim(),
    author: author.trim(),
    url: url.trim(),
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBlog(newBlog);

    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <Typography variant="h3">Create new</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Input stuff={title} setStuff={setTitle}>
          Title
        </Input>

        <Input stuff={author} setStuff={setAuthor}>
          Author
        </Input>

        <Input stuff={url} setStuff={setUrl}>
          Url
        </Input>

        <Button variant="contained" type="submit">
          Create
        </Button>
      </Box>
    </div>
  );
};

export default BlogEditor;
