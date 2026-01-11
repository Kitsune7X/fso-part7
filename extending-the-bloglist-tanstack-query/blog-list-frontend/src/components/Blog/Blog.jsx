// https://vite.dev/guide/features#css-modules

import { Link } from '@tanstack/react-router';

import { Card, CardContent, Link as MuiLink, Typography } from '@mui/material';

const Blog = ({ blog }) => {
  return (
    <Card>
      <CardContent>
        <Link
          to="/blogs/$blogId"
          params={{
            blogId: blog.id,
          }}
          style={{ textDecoration: 'none' }}
        >
          <MuiLink underline="hover" color="text.primary">
            <Typography variant="h6">"{blog.title}"</Typography> by{' '}
            {blog.author}
          </MuiLink>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Blog;
