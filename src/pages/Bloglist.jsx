import React, { Fragment } from 'react'
import { Blogcard } from '../components/Blogcard'

export const Bloglist = () => {
  const MOCK_POSTS = [
    {
      id: 1,
      title: 'The Future of Minimalist UI Design in 2025',
      excerpt:
        'Discover how simplified interfaces are driving higher user engagement and reducing cognitive load in modern web applications.',
      author: 'Alex Rivera',
      createdDate: 'Oct 12, 2024',
      updatedDate: 'Oct 15, 2024',
      likes: 124,
      readTime: '5 min read',
      image:
        'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
      content:
        "Minimalism in UI design is more than just 'white space'. It's about intentionality. In this post, we explore the core pillars of modern minimalism: Typography, Purposeful Color, and Motion. When we remove the clutter, the user's focus naturally gravitates towards the content that matters most...",
    },
    {
      id: 2,
      title: 'Mastering Tailwind CSS for Scalable Projects',
      excerpt:
        'Learn the advanced patterns for maintaining large-scale CSS architectures using utility-first frameworks without the bloat.',
      author: 'Sarah Chen',
      createdDate: 'Nov 02, 2024',
      updatedDate: 'Nov 03, 2024',
      likes: 89,
      readTime: '8 min read',
      image:
        'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800',
      content:
        'Tailwind has changed the way we think about styling. By using a configuration-driven approach, teams can ensure visual consistency across thousands of components...',
    },
    {
      id: 3,
      title: 'The Rise of Edge Computing in Web Development',
      excerpt:
        'Why moving your logic closer to the user is the next big step for performance-critical applications and global distribution.',
      author: 'Jordan Smith',
      createdDate: 'Dec 20, 2024',
      updatedDate: 'Dec 21, 2024',
      likes: 215,
      readTime: '6 min read',
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
      content:
        'Edge computing is transforming how we deploy applications. By executing code at CDN nodes, we reduce latency to near-zero for users regardless of their location...',
    },
  ]
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {MOCK_POSTS.map((post) => (
        <Fragment key={post.id}>
          <Blogcard post={post} />
        </Fragment>
      ))}
    </div>
  )
}
