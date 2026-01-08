import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/fuck')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/fuck"!</div>
}
