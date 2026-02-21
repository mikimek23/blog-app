import React from 'react'
import { Button } from './Button'
import { ArrowLeft, Bookmark, Heart, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const FullPostView = ({ post }) => {
  const navigate = useNavigate()
  return (
    <div className='max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <button
        onClick={() => navigate('/posts')}
        className='mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-medium'
      >
        <ArrowLeft size={20} /> Back to feed
      </button>

      <header className='mb-10'>
        <div className='flex items-center gap-3 text-sm text-blue-600 font-bold mb-4 uppercase tracking-widest'>
          <span>Articles</span>
          <span className='text-slate-300'>•</span>
          <span>{post.readTime}</span>
        </div>
        <h1 className='text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6'>
          {post.title}
        </h1>

        <div className='flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-slate-100'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl'>
              {post.author[0]}
            </div>
            <div>
              <div className='font-bold text-slate-900'>{post.author}</div>
              <div className='text-sm text-slate-500'>
                Published on {post.createdDate}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='outline' size='icon'>
              <Share2 size={18} />
            </Button>
            <Button variant='outline' size='icon'>
              <Bookmark size={18} />
            </Button>
            <Button variant='primary' iconLeft={Heart} className='px-6'>
              {post.likes}
            </Button>
          </div>
        </div>
      </header>

      <div className='relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl'>
        <img
          src={post.image}
          alt={post.title}
          className='w-full h-full object-cover'
        />
      </div>

      <article className='prose prose-slate prose-lg max-w-none'>
        <p className='text-xl text-slate-600 leading-relaxed mb-8 font-medium'>
          {post.excerpt}
        </p>
        <div className='text-slate-800 leading-loose space-y-6'>
          {post.content}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
        </div>
      </article>
    </div>
  )
}
