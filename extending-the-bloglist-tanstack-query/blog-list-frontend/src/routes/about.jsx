import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

const About = () => {
  return <div>Hello from About!</div>;
};
