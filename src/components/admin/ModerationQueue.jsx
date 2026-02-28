import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  listModerationComments,
  updateModerationComment,
} from '../../api/comments.js'
import { Button } from '../Button.jsx'

export const ModerationQueue = () => {
  const [status, setStatus] = useState('pending')
  const [cursorStack, setCursorStack] = useState([null])
  const cursor = cursorStack[cursorStack.length - 1]
  const queryClient = useQueryClient()

  const moderationQuery = useQuery({
    queryKey: ['moderation-comments', status, cursor],
    queryFn: () =>
      listModerationComments({
        status,
        cursor,
        limit: 20,
      }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ commentId, nextStatus }) =>
      updateModerationComment(commentId, nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-comments'] })
    },
  })

  const comments = moderationQuery.data?.data || []
  const meta = moderationQuery.data?.meta

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2'>
        {['pending', 'approved', 'rejected', 'all'].map((value) => (
          <Button
            key={value}
            type='button'
            size='sm'
            variant={status === value ? 'primary' : 'secondary'}
            onClick={() => {
              setStatus(value)
              setCursorStack([null])
            }}
          >
            {value}
          </Button>
        ))}
      </div>

      <div className='space-y-4'>
        {moderationQuery.isLoading && (
          <p className='text-slate-500'>Loading moderation queue...</p>
        )}
        {!moderationQuery.isLoading &&
          comments.map((comment) => (
            <article
              key={comment._id}
              className='rounded-xl border border-slate-100 bg-white p-4'
            >
              <p className='font-semibold text-slate-900'>
                {comment.author?.username || 'Unknown'} on{' '}
                {comment.post?.title || 'Unknown post'}
              </p>
              <p className='text-sm text-slate-500 mt-1'>
                Status: {comment.moderationStatus}
                {comment.isFlagged &&
                  ` • Flagged: ${comment.flaggedReason || 'No reason'}`}
              </p>
              <p className='mt-3 text-slate-700 whitespace-pre-wrap'>
                {comment.content}
              </p>
              <div className='mt-4 flex gap-2'>
                <Button
                  type='button'
                  size='sm'
                  variant='secondary'
                  onClick={() =>
                    updateMutation.mutate({
                      commentId: comment._id,
                      nextStatus: 'approved',
                    })
                  }
                >
                  Approve
                </Button>
                <Button
                  type='button'
                  size='sm'
                  variant='destructive'
                  onClick={() =>
                    updateMutation.mutate({
                      commentId: comment._id,
                      nextStatus: 'rejected',
                    })
                  }
                >
                  Reject
                </Button>
              </div>
            </article>
          ))}
        {!moderationQuery.isLoading && comments.length === 0 && (
          <p className='text-slate-500'>No comments in this queue.</p>
        )}
      </div>

      <div className='flex items-center justify-center gap-3'>
        <Button
          type='button'
          variant='secondary'
          disabled={cursorStack.length <= 1}
          onClick={() => setCursorStack((stack) => stack.slice(0, -1))}
        >
          Previous
        </Button>
        <Button
          type='button'
          variant='secondary'
          disabled={!meta?.hasNextPage || !meta?.nextCursor}
          onClick={() => setCursorStack((stack) => [...stack, meta.nextCursor])}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
