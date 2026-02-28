import { useEffect, useMemo, useState } from 'react'
import { Button } from '../Button.jsx'
import { Edit3, Plus, Search, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteAdminPost, listPosts } from '../../api/posts.js'

const formatDate = (dateValue) => {
  if (!dateValue) return '-'
  return new Date(dateValue).toLocaleDateString()
}

export const ManagePost = () => {
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-posts', page, searchTerm],
    queryFn: () =>
      listPosts({
        page,
        limit: 10,
        search: searchTerm || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
  })

  const deleteMutation = useMutation({
    mutationFn: (postId) => deleteAdminPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
  })

  const posts = useMemo(() => data?.data || [], [data?.data])
  const meta = data?.meta

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextTerm = searchInput.trim()
      setPage(1)
      setSearchTerm(nextTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const handleEdit = (post) => {
    navigate(`/admin/posts/${post._id}/edit`)
  }

  const handleDelete = (postId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post?',
    )
    if (!confirmed) return
    deleteMutation.mutate(postId)
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='relative w-full sm:w-96'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 ui-text-muted'
            size={18}
          />
          <input
            type='text'
            placeholder='Search posts...'
            className='ui-input pl-10 pr-4 py-2.5'
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <Button
          iconLeft={Plus}
          onClick={() => navigate('/admin/posts/create')}
          type='button'
        >
          New Post
        </Button>
      </div>

      {isError && (
        <div className='rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
          Could not load posts right now.
        </div>
      )}

      <div className='rounded-3xl overflow-hidden ui-surface'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='border-b ui-border text-sm font-semibold ui-text-muted uppercase tracking-wider bg-[var(--color-surface-soft)]'>
                <th className='p-5'>Post Title</th>
                <th className='p-5 hidden md:table-cell'>Date</th>
                <th className='p-5 hidden sm:table-cell'>Status</th>
                <th className='p-5 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {isLoading && (
                <tr>
                  <td colSpan='4' className='p-8 text-center ui-text-muted'>
                    Loading posts...
                  </td>
                </tr>
              )}
              {!isLoading &&
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className='transition-colors group border-t ui-border hover:bg-[var(--color-surface-soft)]'
                  >
                    <td className='p-5'>
                      <p className='font-bold ui-heading line-clamp-1'>
                        {post.title}
                      </p>
                      <p className='ui-text-muted mt-1 hidden md:block'>
                        by {post.author?.username || 'Unknown'}
                      </p>
                    </td>
                    <td className='p-5 ui-text-muted hidden md:table-cell whitespace-nowrap'>
                      {formatDate(post.createdAt)}
                    </td>
                    <td className='p-5 hidden sm:table-cell'>
                      <span className='px-3 py-1 rounded-full text-xs font-bold border ui-alert-success'>
                        Published
                      </span>
                    </td>
                    <td className='p-5 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='secondary'
                          size='icon'
                          onClick={() => handleEdit(post)}
                          title='Edit'
                          type='button'
                        >
                          <Edit3 size={16} className='ui-text' />
                        </Button>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => handleDelete(post._id)}
                          title='Delete'
                          type='button'
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              {!isLoading && posts.length === 0 && (
                <tr>
                  <td colSpan='4' className='p-8 text-center ui-text-muted'>
                    No posts found. Start writing!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex items-center justify-center gap-3'>
        <Button
          type='button'
          variant='secondary'
          disabled={!meta || page <= 1}
          onClick={() => setPage((value) => Math.max(value - 1, 1))}
        >
          Previous
        </Button>
        <span className='text-sm ui-text-muted'>
          Page {meta?.page || 1} of {meta?.totalPages || 1}
        </span>
        <Button
          type='button'
          variant='secondary'
          disabled={!meta || page >= meta.totalPages}
          onClick={() => setPage((value) => value + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
