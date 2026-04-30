import { Clock, FileText, Plus, Send } from 'lucide-react'
import { Button } from '../Button.jsx'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listAdminPosts } from '../../api/posts.js'

export const PostStatus = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-posts', 'dashboard'],
    queryFn: () => listAdminPosts({ page: 1, limit: 100, status: 'all' }),
  })

  const posts = Array.isArray(data?.data) ? data.data : []
  const draftPosts = posts.filter((post) => post.status === 'draft').length
  const scheduledPosts = posts.filter(
    (post) => post.status === 'scheduled',
  ).length
  const publishedPosts = posts.filter(
    (post) => (post.status || 'published') === 'published',
  ).length

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='p-6 rounded-3xl flex items-center gap-4 ui-surface'>
          <div className='w-14 h-14 rounded-2xl ui-surface-soft text-[var(--color-accent)] flex items-center justify-center'>
            <FileText size={24} />
          </div>
          <div>
            <p className='text-sm font-semibold ui-text-muted'>Draft Posts</p>
            <h3 className='text-2xl font-bold ui-heading'>
              {isLoading ? '...' : draftPosts}
            </h3>
          </div>
        </div>
        <div className='p-6 rounded-3xl flex items-center gap-4 ui-surface'>
          <div className='w-14 h-14 rounded-2xl ui-surface-soft text-amber-600 flex items-center justify-center'>
            <Clock size={24} />
          </div>
          <div>
            <p className='text-sm font-semibold ui-text-muted'>
              Scheduled Posts
            </p>
            <h3 className='text-2xl font-bold ui-heading'>
              {isLoading ? '...' : scheduledPosts}
            </h3>
          </div>
        </div>
        <div className='p-6 rounded-3xl flex items-center gap-4 ui-surface'>
          <div className='w-14 h-14 rounded-2xl ui-surface-soft text-[var(--color-success)] flex items-center justify-center'>
            <Send size={24} />
          </div>
          <div>
            <p className='text-sm font-semibold ui-text-muted'>
              Published Posts
            </p>
            <h3 className='text-2xl font-bold ui-heading'>
              {isLoading ? '...' : publishedPosts}
            </h3>
          </div>
        </div>
      </div>

      {isError && (
        <div className='rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700'>
          Could not load post stats right now. You can still create a new post.
        </div>
      )}

      <div className='rounded-3xl p-8 text-center mt-8 ui-surface'>
        <h3 className='text-xl font-bold ui-heading mb-2'>Ready to write?</h3>
        <p className='ui-text-muted mb-6'>
          Share your latest thoughts with your readers.
        </p>
        <Button
          iconLeft={Plus}
          type='button'
          onClick={() => navigate('/admin/posts/create')}
        >
          Create New Post
        </Button>
      </div>
    </div>
  )
}
