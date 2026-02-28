import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicProfile } from '../api/profiles.js'
import { Blogcard } from '../components/Blogcard.jsx'
import { Button } from '../components/Button.jsx'

export const UserProfile = () => {
  const { username } = useParams()
  const [cursorStack, setCursorStack] = useState([null])
  const cursor = cursorStack[cursorStack.length - 1]

  const profileQuery = useQuery({
    queryKey: ['profile', username, cursor],
    queryFn: () => getPublicProfile(username, { cursor, limit: 6 }),
  })

  if (profileQuery.isLoading) {
    return <div className='text-center ui-text-muted'>Loading profile...</div>
  }

  if (profileQuery.isError) {
    return <div className='text-center text-red-600'>Profile not found.</div>
  }

  const payload = profileQuery.data?.data || {}
  const profile = payload.profile
  const posts = payload.posts || []
  const meta = profileQuery.data?.meta

  return (
    <section className='space-y-8'>
      <header className='max-w-4xl mx-auto rounded-2xl p-6 ui-surface'>
        <h2 className='text-3xl font-bold ui-heading'>{profile?.username}</h2>
        <p className='ui-text-muted mt-2'>{profile?.bio || 'No bio yet.'}</p>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {posts.map((post) => (
          <Blogcard key={post._id} post={post} />
        ))}
      </div>

      <div className='flex items-center justify-center gap-3'>
        <Button
          type='button'
          variant='secondary'
          disabled={cursorStack.length <= 1}
          onClick={() => setCursorStack((stack) => stack.slice(0, -1))}
        >
          Previous
        </Button>
        <Button
          type='button'
          variant='secondary'
          disabled={!meta?.hasNextPage || !meta?.nextCursor}
          onClick={() => setCursorStack((stack) => [...stack, meta.nextCursor])}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
