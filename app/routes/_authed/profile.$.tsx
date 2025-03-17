import { Link, Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/profile/$')({
  component: PostsComponent,
})

function PostsComponent() {
  return (
    <div className="p-2 flex gap-2">
      profile
      <hr />
      <Outlet />
    </div>
  )
}
