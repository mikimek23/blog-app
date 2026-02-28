import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PenSquare } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createAdminPost,
  getPostById,
  listPosts,
  updateAdminPost,
} from '../../api/posts.js'
import { Button } from '../Button.jsx'

const INITIAL_FORM = {
  title: '',
  content: '',
  tags: '',
}

export const PostForm = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [message, setMessage] = useState([null, null])
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const { data: listData } = useQuery({
    queryKey: ['admin-posts', 1],
    queryFn: () => listPosts({ page: 1, limit: 5 }),
  })

  const editQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
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
    })
    setPreview(post.imageUrl || '')
  }, [editQuery.data])

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
    if (form.title) formData.append('title', form.title)
    if (form.content) formData.append('content', form.content)
    formData.append('tags', JSON.stringify(parsedTags))
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
          : 'Post created successfully.',
        true,
      ])
      if (!isEditMode) {
        setForm(INITIAL_FORM)
        setImage(null)
        setPreview('')
      }
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', id] })
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

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <section className='lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8'>
        <div className='flex items-center gap-3 mb-6'>
          <div className='w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center'>
            <PenSquare size={18} />
          </div>
          <div>
            <h2 className='text-xl font-bold text-slate-800'>
              {isEditMode ? 'Edit Post' : 'Create Post'}
            </h2>
            <p className='text-sm text-slate-500'>
              {isEditMode
                ? 'Update your published post.'
                : 'Publish a new post for your audience.'}
            </p>
          </div>
        </div>

        {message[0] && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium ${
              message[1]
                ? 'bg-green-50 text-green-700 border border-green-100'
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {message[0]}
          </div>
        )}

        <form className='space-y-5' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-semibold text-slate-700 mb-1.5'
            >
              Title
            </label>
            <input
              id='title'
              name='title'
              value={form.title}
              onChange={handleChange}
              required={!isEditMode}
              className='w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 text-gray-800'
              placeholder='Write a clear post title'
            />
            <p className='text-xs text-slate-500 mt-2'>
              Slug preview: {slugPreview || '-'}
            </p>
          </div>

          <div>
            <label
              htmlFor='image'
              className='block text-sm font-semibold text-slate-700 mb-1.5'
            >
              Cover Image
            </label>
            <input
              type='file'
              id='image'
              name='image'
              accept='image/*'
              onChange={handleFileChange}
              className='w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 text-gray-800'
            />
            {preview && (
              <img
                src={preview}
                alt='Preview'
                className='mt-3 h-40 w-full object-cover rounded-xl border border-slate-200'
              />
            )}
          </div>

          <div>
            <label
              htmlFor='tags'
              className='block text-sm font-semibold text-slate-700 mb-1.5'
            >
              Tags
            </label>
            <input
              id='tags'
              name='tags'
              value={form.tags}
              onChange={handleChange}
              className='w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 text-gray-800'
              placeholder='react, javascript, css'
            />
          </div>

          <div>
            <label
              htmlFor='content'
              className='block text-sm font-semibold text-slate-700 mb-1.5'
            >
              Content
            </label>
            <textarea
              id='content'
              name='content'
              value={form.content}
              onChange={handleChange}
              required={!isEditMode}
              rows={8}
              className='w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500 resize-y text-gray-800'
              placeholder='Write your post content'
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              type='submit'
              variant='primary'
              isLoading={mutation.isPending}
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
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

      <aside className='bg-white rounded-3xl border border-slate-100 shadow-sm p-6'>
        <h3 className='text-lg font-bold text-slate-800 mb-4'>Recent Posts</h3>
        <div className='space-y-3'>
          {posts.length === 0 ? (
            <p className='text-sm text-slate-500'>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className='rounded-xl border border-slate-100 p-3'
              >
                <p className='text-sm font-semibold text-slate-800 line-clamp-2'>
                  {post.title}
                </p>
                <p className='text-xs text-slate-500 mt-1 line-clamp-1'>
                  {post.slug}
                </p>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}
