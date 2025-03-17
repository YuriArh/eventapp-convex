import { convexQuery } from '@convex-dev/react-query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ErrorComponent, createFileRoute } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { NotFound } from '@/shared/ui/NotFound'

export const Route = createFileRoute('/_authed/posts/$postId')({
  loader: async ({ params: { postId }, context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.posts.get, { postId }),
    )
  },

  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>
  },
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function PostComponent() {
  const { postId } = Route.useParams()
  const { data, isLoading } = useSuspenseQuery(
    convexQuery(api.posts.get, { postId }),
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xl font-bold underline">{data?.title}</h4>
      <div className="text-sm">{data?.body}</div>
    </div>
  )
}
