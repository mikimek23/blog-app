import { Fragment, useEffect, useMemo, useState } from 'react'
import { Blogcard } from '../components/Blogcard.jsx'
import { useQuery } from '@tanstack/react-query'
import { listPosts } from '../api/posts.js'
import { Search, X } from 'lucide-react'
import { Button } from '../components/Button.jsx'

export const Bloglist = () => {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [cursorStack, setCursorStack] = useState([null])
  const currentCursor = cursorStack[cursorStack.length - 1]

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim()
      setSearch((current) => {
        if (current === nextSearch) return current
        setCursorStack([null])
        return nextSearch
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput])

  const handleClearSearch = () => {
    setSearchInput('')
  }

  const queryParams = useMemo(
    () => ({
      limit: 9,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      cursor: currentCursor || undefined,
      search: search || undefined,
    }),
    [currentCursor, search],
  )

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ['posts', queryParams],
    queryFn: () => listPosts(queryParams),
    placeholderData: (previousData) => previousData,
  })

  const posts = data?.data || []
  const meta = data?.meta

  if (isLoading) {
    return <div className='text-center text-slate-500'>Loading posts...</div>
  }

  if (isError) {
    return (
      <div className='text-center'>
        <p className='text-red-600'>Failed to load posts.</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='max-w-xl mx-auto'>
        <div className='relative'>
          <Search
            className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-800'
            size={18}
          />
          <input
            type='text'
            placeholder='Search posts by keyword...'
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className='w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 outline-none focus:border-blue-500 text-gray-500'
          />
          {searchInput && (
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700'
              onClick={handleClearSearch}
              aria-label='Clear search'
            >
              <X size={16} />
            </button>
          )}
        </div>
        {isFetching && (
          <p className='text-xs text-slate-500 mt-2'>Updating results...</p>
        )}
      </div>

      {posts.length === 0 ? (
        <div className='text-center text-slate-500'>
          {search ? 'No posts matched your search.' : 'No posts available yet.'}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {posts.map((post) => (
            <Fragment key={post._id}>
              <Blogcard post={post} />
            </Fragment>
          ))}
        </div>
      )}

      <div className='flex items-center justify-center gap-3'>
        <Button
          type='button'
          variant='secondary'
          disabled={cursorStack.length <= 1}
          onClick={() => {
            setCursorStack((stack) => stack.slice(0, -1))
          }}
        >
          Previous
        </Button>
        <Button
          type='button'
          variant='secondary'
          disabled={!meta?.hasNextPage || !meta?.nextCursor}
          onClick={() => {
            setCursorStack((stack) => [...stack, meta.nextCursor])
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
