import { createFileRoute } from '@tanstack/react-router';
import App from '../App';

export const Route = createFileRoute('/blogs/')({
  component: RouteComponent,
});

const RouteComponent = () => {
  return <App />;
};
