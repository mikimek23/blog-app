import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, RefreshCcw } from 'lucide-react'
import { listPosts } from '../api/posts.js'
import { Blogcard } from './Blogcard.jsx'
import { Button } from './Button.jsx'
import { useAuth } from '../hooks/useAuth.js'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'

const HOME_QUERY_PARAMS = {
  limit: 7,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

const ctaBaseClass =
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 active:scale-95'

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date'
  return new Date(dateValue).toLocaleDateString()
}

const extractExcerpt = (content, maxLength = 220) => {
  const text = String(content || '').trim()
  if (!text) return 'No summary available yet.'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}

const getPostId = (post) => post?._id || post?.id

const getTopTags = (posts, maxTags = 6) => {
  const counts = new Map()

  posts.forEach((post) => {
    const tags = Array.isArray(post?.tags) ? post.tags : []
    tags.forEach((tag) => {
      const normalized = String(tag || '')
        .trim()
        .toLowerCase()
      if (!normalized) return
      const current = counts.get(normalized) || 0
      counts.set(normalized, current + 1)
    })
  })

  return Array.from(counts.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1]
      return a[0].localeCompare(b[0])
    })
    .slice(0, maxTags)
    .map(([tag]) => tag)
}

const HeroSection = ({ isAuthenticated }) => {
  return (
    <section className='home-section-animate max-w-5xl mx-auto text-center'>
      <p className='inline-flex items-center rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 backdrop-blur'>
        Editorial insights for modern builders
      </p>

      <h1 className='font-editorial mt-6 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl'>
        Practical stories and ideas from shipping real software.
      </h1>

      <p className='mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:text-lg'>
        Read thoughtful articles on product engineering, architecture choices,
        and front-end craft from a team focused on clarity and execution.
      </p>

      <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
        <Link
          to='/posts'
          className={`${ctaBaseClass} gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3.5 text-lg text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30`}
        >
          Read Latest Posts <ArrowRight size={20} />
        </Link>
        <Link
          to={isAuthenticated ? '/profile' : '/signup'}
          className={`${ctaBaseClass} border-2 border-indigo-200 bg-white px-8 py-3.5 text-lg text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50`}
        >
          {isAuthenticated ? 'Go to Profile' : 'Create Account'}
        </Link>
      </div>
    </section>
  )
}

const FeaturedSection = ({ post }) => {
  const postId = getPostId(post)
  if (!post || !postId) return null

  const authorName = post?.author?.username || 'Unknown'

  return (
    <section className='home-section-animate max-w-6xl mx-auto mt-14'>
      <div className='mb-5 flex items-end justify-between gap-4'>
        <h2 className='font-editorial text-3xl font-bold text-slate-900'>
          Featured story
        </h2>
        <Link to='/posts' className='home-link text-sm font-semibold'>
          View all posts
        </Link>
      </div>

      <article className='grid overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)] md:grid-cols-[1.15fr_1fr]'>
        <div className='aspect-[16/11] overflow-hidden md:aspect-auto'>
          <img
            src={post.imageUrl || FALLBACK_IMAGE}
            alt={`Cover image for ${post.title || 'featured article'}`}
            className='h-full w-full object-cover'
          />
        </div>

        <div className='flex flex-col justify-between p-6 sm:p-8'>
          <div>
            <div className='flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.12em] text-slate-500'>
              <span>{formatDate(post.createdAt)}</span>
              <span aria-hidden='true'>&bull;</span>
              <span>{authorName}</span>
            </div>
            <h3 className='font-editorial mt-4 text-3xl font-bold leading-tight text-slate-900'>
              {post.title}
            </h3>
            <p className='mt-4 text-slate-600'>
              {extractExcerpt(post.content)}
            </p>
          </div>

          <div className='mt-6'>
            <Link
              to={`/posts/${postId}`}
              className='inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-600'
            >
              Read article <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>
    </section>
  )
}

const TopicsSection = ({ tags }) => {
  if (!tags.length) return null

  return (
    <section className='home-section-animate max-w-6xl mx-auto mt-14'>
      <h2 className='font-editorial text-2xl font-bold text-slate-900'>
        Browse by topic
      </h2>
      <div className='mt-4 flex flex-wrap gap-2.5'>
        {tags.map((tag) => (
          <Link
            key={tag}
            to={`/posts?search=${encodeURIComponent(tag)}`}
            className='inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-200 hover:text-indigo-700'
          >
            #{tag}
          </Link>
        ))}
      </div>
    </section>
  )
}

const LatestPostsSection = ({ posts }) => {
  if (!posts.length) return null

  return (
    <section className='home-section-animate max-w-6xl mx-auto mt-14'>
      <div className='mb-5 flex items-end justify-between gap-4'>
        <h2 className='font-editorial text-3xl font-bold text-slate-900'>
          Latest posts
        </h2>
        <Link to='/posts' className='home-link text-sm font-semibold'>
          Explore all
        </Link>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {posts.map((post) => (
          <div className='home-card-animate' key={getPostId(post)}>
            <Blogcard post={post} />
          </div>
        ))}
      </div>
    </section>
  )
}

const FinalCtaSection = ({ isAuthenticated }) => {
  return (
    <section className='home-section-animate max-w-6xl mx-auto mt-16'>
      <div className='rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-6 shadow-[0_25px_70px_-45px_rgba(67,56,202,0.45)] sm:p-8'>
        <h2 className='font-editorial text-3xl font-bold text-slate-900'>
          Keep reading what matters
        </h2>
        <p className='mt-3 max-w-2xl text-slate-600'>
          Discover technical write-ups, practical guides, and thoughtful ideas
          curated for engineers who ship.
        </p>

        <div className='mt-6 flex flex-wrap gap-3'>
          <Link
            to='/posts'
            className={`${ctaBaseClass} gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-base text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30`}
          >
            Explore All Articles <ArrowRight size={18} />
          </Link>
          {!isAuthenticated && (
            <Link
              to='/signup'
              className={`${ctaBaseClass} bg-indigo-50 px-5 py-2.5 text-base text-indigo-700 hover:bg-indigo-100`}
            >
              Create Free Account
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

const HomeSkeleton = () => {
  return (
    <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
      <section className='max-w-5xl mx-auto text-center'>
        <div className='mx-auto h-6 w-56 animate-pulse rounded-full bg-slate-200'></div>
        <div className='mx-auto mt-6 h-14 w-full max-w-3xl animate-pulse rounded-2xl bg-slate-200'></div>
        <div className='mx-auto mt-4 h-5 w-full max-w-2xl animate-pulse rounded-xl bg-slate-200'></div>
        <div className='mx-auto mt-8 h-12 w-52 animate-pulse rounded-xl bg-slate-200'></div>
      </section>

      <section className='mt-14 grid overflow-hidden rounded-3xl border border-slate-200 bg-white md:grid-cols-[1.15fr_1fr]'>
        <div className='aspect-[16/11] animate-pulse bg-slate-200 md:aspect-auto'></div>
        <div className='p-6 sm:p-8 space-y-3'>
          <div className='h-3 w-40 animate-pulse rounded bg-slate-200'></div>
          <div className='h-8 w-full animate-pulse rounded bg-slate-200'></div>
          <div className='h-4 w-11/12 animate-pulse rounded bg-slate-200'></div>
          <div className='h-4 w-9/12 animate-pulse rounded bg-slate-200'></div>
        </div>
      </section>

      <section className='mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-card-${index}`}
            className='h-[380px] animate-pulse rounded-3xl border border-slate-200 bg-slate-100'
          />
        ))}
      </section>
    </div>
  )
}

const HomeError = ({ onRetry }) => {
  return (
    <section className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
      <div className='rounded-3xl border border-red-200 bg-red-50 p-8'>
        <h2 className='font-editorial text-3xl font-bold text-slate-900'>
          We could not load the homepage content
        </h2>
        <p className='mt-3 text-slate-600'>
          Please try again, or continue to the full posts feed.
        </p>

        <div className='mt-6 flex flex-wrap justify-center gap-3'>
          <Button variant='destructive' onClick={onRetry} iconLeft={RefreshCcw}>
            Retry
          </Button>
          <Link
            to='/posts'
            className={`${ctaBaseClass} gap-2 bg-indigo-50 px-5 py-2.5 text-base text-indigo-700 hover:bg-indigo-100`}
          >
            Go to Posts <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

const HomeEmpty = () => {
  return (
    <section className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
      <div className='rounded-3xl border border-slate-200 bg-white p-8'>
        <h2 className='font-editorial text-3xl font-bold text-slate-900'>
          No posts yet
        </h2>
        <p className='mt-3 text-slate-600'>
          New articles will appear here as soon as they are published.
        </p>
        <div className='mt-6'>
          <Link
            to='/posts'
            className={`${ctaBaseClass} gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-base text-white hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg hover:shadow-indigo-500/30`}
          >
            Browse Posts <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export const Home = () => {
  const { isAuthenticated } = useAuth()

  const postsQuery = useQuery({
    queryKey: ['home-posts', HOME_QUERY_PARAMS],
    queryFn: () => listPosts(HOME_QUERY_PARAMS),
    staleTime: 60 * 1000,
  })

  if (postsQuery.isLoading) {
    return <HomeSkeleton />
  }

  if (postsQuery.isError) {
    return <HomeError onRetry={() => postsQuery.refetch()} />
  }

  const posts = postsQuery.data?.data || []
  const featuredPost = posts[0] || null
  const latestPosts = posts.slice(1, 7)
  const topTags = getTopTags(posts, 6)

  if (!posts.length) {
    return <HomeEmpty />
  }

  return (
    <div className='home-surface mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8'>
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturedSection post={featuredPost} />
      <TopicsSection tags={topTags} />
      <LatestPostsSection posts={latestPosts} />
      <FinalCtaSection isAuthenticated={isAuthenticated} />
      {postsQuery.isFetching && (
        <p className='mx-auto mt-8 max-w-6xl text-right text-xs text-slate-500'>
          Refreshing stories...
        </p>
      )}
    </div>
  )
}
