import { Link } from '@tanstack/react-router';

const Users = ({ users }) => {
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>
            <strong>Blogs created</strong>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <Link to={user.id}>
              <th>{user.name}</th>
            </Link>
            <td data-testid="test-blog-cell">{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Users;
