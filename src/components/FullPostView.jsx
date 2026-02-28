import { Button } from './Button.jsx'
import { ArrowLeft, Bookmark, Heart, Share2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date'
  return new Date(dateValue).toLocaleDateString()
}

const readTime = (content) => {
  const words = String(content || '')
    .split(/\s+/)
    .filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

export const FullPostView = ({ post, likeStats, onToggleLike, canLike }) => {
  const navigate = useNavigate()
  const authorName = post?.author?.username || 'Unknown author'

  if (!post) {
    return (
      <div className='max-w-4xl mx-auto text-center py-16'>
        <h2 className='text-2xl font-bold text-slate-800'>Post not found</h2>
        <Button className='mt-6' onClick={() => navigate('/posts')}>
          Back to posts
        </Button>
      </div>
    )
  }

  return (
    <div className='max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <button
        type='button'
        onClick={() => navigate('/posts')}
        className='mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium'
      >
        <ArrowLeft size={20} /> Back to feed
      </button>

      <header className='mb-10'>
        <div className='flex items-center gap-3 text-sm text-blue-600 font-bold mb-4 uppercase tracking-widest'>
          <span>Articles</span>
          <span className='text-slate-300'>•</span>
          <span>{readTime(post.content)}</span>
        </div>
        <h1 className='text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6'>
          {post.title}
        </h1>

        <div className='flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl'>
              {authorName[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <Link
                to={`/users/${authorName}`}
                className='font-bold text-slate-900 hover:text-blue-600'
              >
                {authorName}
              </Link>
              <div className='text-sm text-slate-500'>
                Published on {formatDate(post.createdAt)}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button type='button' variant='outline' size='icon'>
              <Share2 size={18} />
            </Button>
            <Button type='button' variant='outline' size='icon'>
              <Bookmark size={18} />
            </Button>
            <Button
              type='button'
              variant={likeStats?.likedByCurrentUser ? 'primary' : 'secondary'}
              iconLeft={Heart}
              onClick={onToggleLike}
              disabled={!canLike}
            >
              {likeStats?.totalLikes || post?.totalLikes || 0}
            </Button>
          </div>
        </div>
      </header>

      <div className='relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl'>
        <img
          src={post.imageUrl || FALLBACK_IMAGE}
          alt={post.title}
          className='w-full h-full object-cover'
        />
      </div>

      <article className='prose prose-slate prose-lg max-w-none'>
        <div className='text-slate-800 leading-loose whitespace-pre-wrap'>
          {post.content}
        </div>
      </article>
    </div>
  )
}
