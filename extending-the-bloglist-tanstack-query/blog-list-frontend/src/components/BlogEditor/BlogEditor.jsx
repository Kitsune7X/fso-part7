import { useState } from 'react';
import Input from './Input/Input';
import Button from '@mui/material/Button';

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
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default BlogEditor;
