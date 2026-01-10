import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';

export const Route = createFileRoute('/users/$userId')({
  loader: ({ params: { userId } }) => {
    axios.get(`http://localhost:3003/api/users/${userId}`);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h3>Hello from UserId</h3>
      <p></p>
    </div>
  );
}
