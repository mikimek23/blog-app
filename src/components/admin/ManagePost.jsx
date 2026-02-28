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
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
            size={18}
          />
          <input
            type='text'
            placeholder='Search posts...'
            className='w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-500'
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

      <div className='bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-500 uppercase tracking-wider'>
                <th className='p-5'>Post Title</th>
                <th className='p-5 hidden md:table-cell'>Date</th>
                <th className='p-5 hidden sm:table-cell'>Status</th>
                <th className='p-5 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-sm'>
              {isLoading && (
                <tr>
                  <td colSpan='4' className='p-8 text-center text-slate-500'>
                    Loading posts...
                  </td>
                </tr>
              )}
              {!isLoading &&
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className='hover:bg-slate-50 transition-colors group'
                  >
                    <td className='p-5'>
                      <p className='font-bold text-slate-800 line-clamp-1'>
                        {post.title}
                      </p>
                      <p className='text-slate-400 mt-1 hidden md:block'>
                        by {post.author?.username || 'Unknown'}
                      </p>
                    </td>
                    <td className='p-5 text-slate-500 hidden md:table-cell whitespace-nowrap'>
                      {formatDate(post.createdAt)}
                    </td>
                    <td className='p-5 hidden sm:table-cell'>
                      <span className='px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700'>
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
                          <Edit3 size={16} className='text-slate-600' />
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
                  <td colSpan='4' className='p-8 text-center text-slate-500'>
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
        <span className='text-sm text-slate-500'>
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
