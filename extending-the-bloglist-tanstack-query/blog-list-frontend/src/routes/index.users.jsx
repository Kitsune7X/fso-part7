import { createFileRoute } from '@tanstack/react-router';
import { useUserContext } from '../UserContext';

export const Route = createFileRoute('/index/users')({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useUserContext();

  return (
    <>
      {/* {user && (
        <div>
          <p>{user.name} is here!</p>
        </div>
      )} */}
      <div>WTF!</div>
    </>
  );
}
