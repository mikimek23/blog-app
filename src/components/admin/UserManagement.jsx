import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  adminListUsers,
  adminUpdateUserRole,
  adminUpdateUserStatus,
} from '../../api/profiles.js'
import { Button } from '../Button.jsx'
import { Search } from 'lucide-react'

export const UserManagement = () => {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [cursorStack, setCursorStack] = useState([null])
  const cursor = cursorStack[cursorStack.length - 1]
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['admin-users', search, cursor],
    queryFn: () =>
      adminListUsers({ search: search || undefined, cursor, limit: 15 }),
  })

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminUpdateUserRole(userId, role),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const statusMutation = useMutation({
    mutationFn: ({ userId, isActive }) =>
      adminUpdateUserStatus(userId, isActive),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const users = usersQuery.data?.data || []
  const meta = usersQuery.data?.meta

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
      setCursorStack([null])
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  return (
    <div className='space-y-6'>
      <div className='relative w-full sm:w-96'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 ui-text-muted'
          size={18}
        />
        <input
          type='text'
          placeholder='Search users...'
          className='ui-input pl-10 pr-4 py-2.5'
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />
      </div>

      <div className='rounded-3xl overflow-hidden ui-surface'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='border-b ui-border text-sm font-semibold ui-text-muted uppercase tracking-wider bg-[var(--color-surface-soft)]'>
                <th className='p-5'>User</th>
                <th className='p-5'>Role</th>
                <th className='p-5'>Status</th>
                <th className='p-5 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {usersQuery.isLoading && (
                <tr>
                  <td colSpan='4' className='p-8 text-center ui-text-muted'>
                    Loading users...
                  </td>
                </tr>
              )}
              {!usersQuery.isLoading &&
                users.map((user) => (
                  <tr key={user._id} className='border-t ui-border'>
                    <td className='p-5'>
                      <p className='font-bold ui-heading'>{user.username}</p>
                      <p className='ui-text-muted'>{user.email}</p>
                    </td>
                    <td className={`p-5`}>
                      <span
                        className={`px-2 py-1 rounded-lg border font-bold ${user.role === 'admin' ? 'bg-[var(--color-surface-soft)] text-[var(--color-accent)] border-[var(--color-border)]' : 'bg-[var(--color-surface-soft)] ui-text border-[var(--color-border)]'}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className='p-5'>
                      <span
                        className={`px-2 py-1 rounded-lg border font-bold ${user.isActive ? 'ui-alert-success' : 'ui-alert-error'}`}
                      >
                        {user.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className='p-5 text-right space-x-2'>
                      <Button
                        type='button'
                        size='sm'
                        variant='secondary'
                        onClick={() =>
                          roleMutation.mutate({
                            userId: user._id,
                            role: user.role === 'admin' ? 'user' : 'admin',
                          })
                        }
                      >
                        Toggle Role
                      </Button>
                      <Button
                        type='button'
                        size='sm'
                        variant='destructive'
                        onClick={() =>
                          statusMutation.mutate({
                            userId: user._id,
                            isActive: !user.isActive,
                          })
                        }
                      >
                        {user.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
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
    </div>
  )
}
