import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPostComment,
  deleteComment,
  flagComment,
  listPostComments,
} from '../../api/comments.js'
import { Button } from '../Button.jsx'
import { useAuth } from '../../hooks/useAuth.js'

const formatDate = (dateValue) => {
  if (!dateValue) return ''
  return new Date(dateValue).toLocaleString()
}

export const CommentsPanel = ({ postId }) => {
  const [content, setContent] = useState('')
  const [flash, setFlash] = useState('')
  const queryClient = useQueryClient()
  const { user, isAuthenticated } = useAuth()

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => listPostComments(postId),
  })

  const createMutation = useMutation({
    mutationFn: () => createPostComment(postId, { content }),
    onSuccess: (comment) => {
      setContent('')
      setFlash(
        comment?.moderationStatus === 'pending'
          ? 'Comment submitted and pending moderation.'
          : 'Comment posted.',
      )
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })

  const flagMutation = useMutation({
    mutationFn: (commentId) =>
      flagComment(commentId, { reason: 'Inappropriate content' }),
    onSuccess: () => {
      setFlash('Comment flagged for moderation.')
    },
  })

  const comments = commentsQuery.data || []
  const canSubmit = useMemo(
    () =>
      isAuthenticated &&
      content.trim().length >= 2 &&
      !createMutation.isPending,
    [content, createMutation.isPending, isAuthenticated],
  )

  return (
    <section className='max-w-4xl mx-auto mt-12'>
      <h3 className='text-2xl font-bold ui-heading mb-4'>Comments</h3>

      {flash && (
        <p className='mb-4 text-sm text-[var(--color-accent)]'>{flash}</p>
      )}

      {isAuthenticated ? (
        <form
          className='space-y-3 mb-8'
          onSubmit={(event) => {
            event.preventDefault()
            createMutation.mutate()
          }}
        >
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className='ui-input p-3'
            placeholder='Write your comment...'
            rows={4}
          />
          <Button
            type='submit'
            disabled={!canSubmit}
            isLoading={createMutation.isPending}
          >
            Post Comment
          </Button>
        </form>
      ) : (
        <p className='mb-8 text-sm ui-text-muted'>Log in to leave a comment.</p>
      )}

      {commentsQuery.isLoading && (
        <p className='ui-text-muted'>Loading comments...</p>
      )}
      {commentsQuery.isError && (
        <p className='text-red-600'>Failed to load comments.</p>
      )}

      <div className='space-y-4'>
        {comments.map((comment) => {
          const isOwner = user?.id === comment?.author?._id
          const canDelete = isOwner || user?.role === 'admin'
          return (
            <article key={comment._id} className='rounded-xl p-4 ui-surface'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='font-semibold ui-text'>
                    {comment.author?.username || 'Unknown'}
                  </p>
                  <p className='text-xs ui-text-muted'>
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  {isAuthenticated && !isOwner && (
                    <Button
                      type='button'
                      size='sm'
                      variant='ghost'
                      onClick={() => flagMutation.mutate(comment._id)}
                    >
                      Flag
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      type='button'
                      size='sm'
                      variant='destructive'
                      onClick={() => deleteMutation.mutate(comment._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
              <p className='mt-3 ui-text whitespace-pre-wrap'>
                {comment.content}
              </p>
            </article>
          )
        })}
        {!commentsQuery.isLoading && comments.length === 0 && (
          <p className='ui-text-muted'>No approved comments yet.</p>
        )}
      </div>
    </section>
  )
}
