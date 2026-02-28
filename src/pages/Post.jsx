import { useParams } from 'react-router-dom'
import { FullPostView } from '../components/FullPostView.jsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPostById } from '../api/posts.js'
import { getLikeStats, togglePostLike } from '../api/likes.js'
import { useAuth } from '../hooks/useAuth.js'
import { CommentsPanel } from '../components/comments/CommentsPanel.jsx'

export const Post = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()

  const postQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
  })

  const likesQuery = useQuery({
    queryKey: ['likes', id],
    queryFn: () => getLikeStats(id),
  })

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', id] })
      queryClient.invalidateQueries({ queryKey: ['post', id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  if (postQuery.isLoading) {
    return <div className='text-center text-slate-500'>Loading post...</div>
  }

  if (postQuery.isError) {
    return (
      <div className='text-center text-red-600'>Could not load this post.</div>
    )
  }

  return (
    <div className='space-y-12'>
      <FullPostView
        post={postQuery.data}
        likeStats={likesQuery.data}
        onToggleLike={() => likeMutation.mutate()}
        canLike={isAuthenticated && !likeMutation.isPending}
      />
      <CommentsPanel postId={id} />
    </div>
  )
}
