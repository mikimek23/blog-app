import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProfile, updateMyProfile } from '../api/profiles.js'
import { Button } from '../components/Button.jsx'

export const Profile = () => {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ bio: '', avatarUrl: '' })

  const profileQuery = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => getMyProfile(),
  })

  useEffect(() => {
    if (!profileQuery.data) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      bio: profileQuery.data?.bio || '',
      avatarUrl: profileQuery.data?.avatarUrl || '',
    })
  }, [profileQuery.data])

  const updateMutation = useMutation({
    mutationFn: () => updateMyProfile(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
  })

  if (profileQuery.isLoading) {
    return <div className='text-center text-slate-500'>Loading profile...</div>
  }

  if (profileQuery.isError) {
    return (
      <div className='text-center text-red-600'>Could not load profile.</div>
    )
  }

  const profile = profileQuery.data

  return (
    <section className='max-w-3xl mx-auto space-y-6'>
      <h2 className='text-3xl font-bold text-slate-900'>My Profile</h2>
      <div className='rounded-2xl bg-white border border-slate-100 p-6 space-y-4'>
        <p className='text-sm text-slate-500'>Username: {profile.username}</p>
        <p className='text-sm text-slate-500'>
          Email: {profile.email || 'Private'}
        </p>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-slate-700'>
            Avatar URL
          </label>
          <input
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-gray-500'
            value={form.avatarUrl}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, avatarUrl: event.target.value }))
            }
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-slate-700'>Bio</label>
          <textarea
            className='w-full rounded-xl border border-slate-200 px-3 py-2 text-slate-800'
            rows={4}
            value={form.bio}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, bio: event.target.value }))
            }
          />
        </div>
        <Button
          type='button'
          onClick={() => updateMutation.mutate()}
          isLoading={updateMutation.isPending}
        >
          Save Profile
        </Button>
      </div>
    </section>
  )
}
