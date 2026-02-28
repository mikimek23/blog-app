import { Calendar, Clock, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import slug from 'slug'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800'

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date'
  return new Date(dateValue).toLocaleDateString()
}

export const Blogcard = ({ post }) => {
  const id = post?._id || post?.id
  const authorName = post?.author?.username || post?.authorName || 'Unknown'
  return (
    <Link
      to={`/posts/${id}/${slug(post?.slug)}`}
      className='group rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col h-full ui-surface hover:-translate-y-0.5'
    >
      <div className='relative h-48 overflow-hidden'>
        <img
          src={post?.imageUrl || FALLBACK_IMAGE}
          alt={post?.title}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute top-4 left-4 flex flex-wrap gap-2 '>
          {post?.tags.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className='ui-chip backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold shadow-sm'
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <div className='flex items-center gap-2 text-xs ui-text-muted mb-3'>
          <Calendar size={14} />
          <span>{formatDate(post?.createdAt)}</span>
          <span>•</span>
          <Clock size={14} />
          <span>Updated {formatDate(post?.updatedAt)}</span>
        </div>

        <h3 className='text-xl font-bold ui-heading group-hover:text-[var(--color-accent)] transition-colors mb-2 line-clamp-2'>
          {post?.title}
        </h3>

        <p className='ui-text-muted text-sm line-clamp-3 mb-6 flex-1'>
          {post?.content?.slice(0, 150) || 'No content'}...
        </p>

        <div className='flex items-center justify-between pt-4 border-t ui-border'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full ui-surface-soft flex items-center justify-center text-xs font-bold text-[var(--color-accent)]'>
              {authorName[0]?.toUpperCase() || 'U'}
            </div>
            <span className='text-sm font-semibold ui-text'>{authorName}</span>
          </div>
          <div className='flex items-center gap-1 text-sm ui-text-muted'>
            <Heart size={14} />
            <span>{post?.totalLikes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
