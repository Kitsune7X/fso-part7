import { createFileRoute, Outlet } from '@tanstack/react-router';
import App from '../App';

export const Route = createFileRoute('/')({
  component: Index,
});

const Index = () => {
  return (
    <>
      <App />
    </>
  );
};
