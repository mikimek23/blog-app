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
      className='group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 cursor-pointer flex flex-col h-full'
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
              className='bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm'
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <div className='flex items-center gap-2 text-xs text-slate-400 mb-3'>
          <Calendar size={14} />
          <span>{formatDate(post?.createdAt)}</span>
          <span>•</span>
          <Clock size={14} />
          <span>Updated {formatDate(post?.updatedAt)}</span>
        </div>

        <h3 className='text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2'>
          {post?.title}
        </h3>

        <p className='text-slate-500 text-sm line-clamp-3 mb-6 flex-1'>
          {post?.content?.slice(0, 150) || 'No content'}...
        </p>

        <div className='flex items-center justify-between pt-4 border-t border-slate-50'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-blue-600'>
              {authorName[0]?.toUpperCase() || 'U'}
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              {authorName}
            </span>
          </div>
          <div className='flex items-center gap-1 text-sm text-slate-400'>
            <Heart size={14} />
            <span>{post?.totalLikes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
