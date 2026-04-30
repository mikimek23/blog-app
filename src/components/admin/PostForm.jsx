import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock, PenSquare, Save, Send } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createAdminPost,
  getAdminPostById,
  listAdminPosts,
  updateAdminPost,
} from '../../api/posts.js'
import { Button } from '../Button.jsx'
import { MarkdownEditor } from './MarkdownEditor.jsx'

const INITIAL_FORM = {
  title: '',
  content: '',
  tags: '',
  status: 'published',
  scheduledFor: '',
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', icon: Save },
  { value: 'published', label: 'Publish now', icon: Send },
  { value: 'scheduled', label: 'Schedule', icon: Clock },
]

const toDateTimeLocal = (dateValue) => {
  if (!dateValue) return ''
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return localDate.toISOString().slice(0, 16)
}

const getDefaultScheduledFor = () => {
  const date = new Date()
  date.setHours(date.getHours() + 1)
  return toDateTimeLocal(date)
}

const submitLabelByStatus = {
  draft: 'Save Draft',
  published: 'Publish Post',
  scheduled: 'Schedule Post',
}

export const PostForm = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState([null, null])
  const [loadedPostId, setLoadedPostId] = useState(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const { data: listData } = useQuery({
    queryKey: ['admin-posts', 'recent'],
    queryFn: () => listAdminPosts({ page: 1, limit: 5, status: 'all' }),
  })

  const editQuery = useQuery({
    queryKey: ['admin-post', id],
    queryFn: () => getAdminPostById(id),
    enabled: isEditMode,
  })

  useEffect(() => {
    if (!editQuery.data) return
    const post = editQuery.data
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      title: post.title || '',
      content: post.content || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      status: post.status || 'published',
      scheduledFor: toDateTimeLocal(post.scheduledFor),
    })
    setPreview(post.imageUrl || '')
    setLoadedPostId(id)
  }, [editQuery.data, id])

  const posts = Array.isArray(listData?.data) ? listData.data : []
  const slugPreview = useMemo(
    () =>
      form.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    [form.title],
  )

  const buildFormData = () => {
    const parsedTags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('tags', JSON.stringify(parsedTags))
    formData.append('status', form.status)
    formData.append(
      'scheduledFor',
      form.status === 'scheduled' && form.scheduledFor
        ? new Date(form.scheduledFor).toISOString()
        : '',
    )
    if (image) formData.append('image', image)
    return formData
  }

  const mutation = useMutation({
    mutationFn: () => {
      const formData = buildFormData()
      if (isEditMode) return updateAdminPost(id, formData)
      return createAdminPost(formData)
    },
    onSuccess: () => {
      setMessage([
        isEditMode
          ? 'Post updated successfully.'
          : `${submitLabelByStatus[form.status]} saved successfully.`,
        true,
      ])
      if (!isEditMode) {
        setForm(INITIAL_FORM)
        setImage(null)
        setPreview('')
      }
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-post', id] })
      queryClient.invalidateQueries({ queryKey: ['post', id] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['home-posts'] })
    },
    onError: (error) => {
      setMessage([
        error?.response?.data?.message || 'Could not save post.',
        false,
      ])
    },
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (status) => {
    setForm((prev) => ({
      ...prev,
      status,
      scheduledFor:
        status === 'scheduled'
          ? prev.scheduledFor || getDefaultScheduledFor()
          : '',
    }))
  }

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    setImage(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setMessage([null, null])
    mutation.mutate()
  }

  const isFormReady = !isEditMode || loadedPostId === id

  if (isEditMode && !isFormReady) {
    return (
      <section className='rounded-3xl p-6 sm:p-8 ui-surface'>
        <p className='ui-text-muted'>Loading post editor...</p>
      </section>
    )
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <section className='lg:col-span-2 rounded-3xl p-6 sm:p-8 ui-surface'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 rounded-xl ui-surface-soft text-[var(--color-accent)] flex items-center justify-center'>
            <PenSquare size={18} />
          </div>
          <div>
            <h2 className='text-xl font-bold ui-heading'>
              {isEditMode ? 'Edit Post' : 'Create Post'}
            </h2>
            <p className='text-sm ui-text-muted'>
              {isEditMode
                ? 'Update your post workflow.'
                : 'Write, draft, publish, or schedule a post.'}
            </p>
          </div>
        </div>

        {message[0] && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
              message[1] ? 'ui-alert-success' : 'ui-alert-error'
            }`}
          >
            {message[0]}
          </div>
        )}

        <form className='space-y-5' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-semibold ui-text mb-1.5'
            >
              Title
            </label>
            <input
              id='title'
              name='title'
              value={form.title}
              onChange={handleChange}
              required={!isEditMode}
              className='ui-input px-3 py-2.5'
              placeholder='Write a clear post title'
            />
            <p className='text-xs ui-text-muted mt-2'>
              Slug preview: {slugPreview || '-'}
            </p>
          </div>

          <div>
            <label
              htmlFor='image'
              className='block text-sm font-semibold ui-text mb-1.5'
            >
              Cover Image
            </label>
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleFileChange}
              className='ui-input px-3 py-2.5'
            />
            {preview && (
              <img
                src={preview}
                alt='Preview'
                className='mt-3 h-40 w-full object-cover rounded-xl ui-border'
              />
            )}
          </div>

          <div>
            <label
              htmlFor='tags'
              className='block text-sm font-semibold ui-text mb-1.5'
            >
              Tags
            </label>
            <input
              id='tags'
              name='tags'
              value={form.tags}
              onChange={handleChange}
              className='ui-input px-3 py-2.5'
              placeholder='react, javascript, css'
            />
          </div>

          <div>
            <span className='block text-sm font-semibold ui-text mb-1.5'>
              Publishing
            </span>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
              {STATUS_OPTIONS.map((option) => {
                const Icon = option.icon
                const isSelected = form.status === option.value
                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => handleStatusChange(option.value)}
                    className={`ui-ring-focus flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      isSelected
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]'
                        : 'ui-chip'
                    }`}
                  >
                    <Icon size={16} />
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {form.status === 'scheduled' && (
            <div>
              <label
                htmlFor='scheduledFor'
                className='block text-sm font-semibold ui-text mb-1.5'
              >
                Publish Date And Time
              </label>
              <input
                type='datetime-local'
                id='scheduledFor'
                name='scheduledFor'
                value={form.scheduledFor}
                onChange={handleChange}
                required
                className='ui-input px-3 py-2.5'
              />
            </div>
          )}

          <div>
            <label
              htmlFor='content'
              className='block text-sm font-semibold ui-text mb-1.5'
            >
              Markdown Content
            </label>
            <MarkdownEditor
              value={form.content}
              onChange={(content) => setForm((prev) => ({ ...prev, content }))}
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              type='submit'
              variant='primary'
              isLoading={mutation.isPending}
            >
              {isEditMode ? 'Update Post' : submitLabelByStatus[form.status]}
            </Button>
            <Button
              type='button'
              variant='secondary'
              onClick={() => navigate('/admin/posts')}
            >
              Back to Posts
            </Button>
          </div>
        </form>
      </section>

      <aside className='rounded-3xl p-6 ui-surface'>
        <h3 className='text-lg font-bold ui-heading mb-4'>Recent Posts</h3>
        <div className='space-y-3'>
          {posts.length === 0 ? (
            <p className='text-sm ui-text-muted'>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className='rounded-xl p-3 ui-surface-soft'>
                <p className='text-sm font-semibold ui-text line-clamp-2'>
                  {post.title}
                </p>
                <p className='text-xs ui-text-muted mt-1 line-clamp-1'>
                  {post.status || 'published'} - {post.slug}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
