import { Calendar, Clock, Heart } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export const Blogcard = ({ post }) => {
  return (
    <Link
      to={`/posts/${post.id}`}
      className='group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 cursor-pointer flex flex-col h-full'
    >
      <div className='relative h-48 overflow-hidden'>
        <img
          src={post.image}
          alt={post.title}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
        />
        <div className='absolute top-4 left-4'>
          <span className='bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-blue-600 shadow-sm'>
            {post.readTime}
          </span>
        </div>
      </div>

      <div className='p-6 flex flex-col flex-1'>
        <div className='flex items-center gap-2 text-xs text-slate-400 mb-3'>
          <Calendar size={14} />
          <span>{post.createdDate}</span>
          <span>•</span>
          <Clock size={14} />
          <span>Updated {post.updatedDate}</span>
        </div>

        <h3 className='text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2'>
          {post.title}
        </h3>

        <p className='text-slate-500 text-sm line-clamp-3 mb-6 flex-1'>
          {post.excerpt}
        </p>

        <div className='flex items-center justify-between pt-4 border-t border-slate-50'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full  bg-slate-100 flex items-center justify-center text-xs font-bold text-blue-600'>
              {post.author[0]}
            </div>
            <span className='text-sm font-semibold text-slate-700'>
              {post.author}
            </span>
          </div>
          <div className='flex items-center gap-1.5 text-slate-400 group/like'>
            <Heart
              size={16}
              className='group-hover/like:text-red-500 transition-colors'
            />
            <span className='text-sm font-medium'>{post.likes}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
