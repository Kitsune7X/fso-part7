import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

const Index = () => {
  return (
    <div>
      <h2>SHIT!!!!</h2>
    </div>
  );
};
