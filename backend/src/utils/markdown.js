import MarkdownIt from 'markdown-it'
import sanitizeHtml from 'sanitize-html'

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const sanitizeOptions = {
  allowedTags: [
    'a',
    'blockquote',
    'br',
    'code',
    'del',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'hr',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'table',
    'tbody',
    'td',
    'thead',
    'tr',
    'th',
    'ul',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    code: ['class'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['align'],
    td: ['align'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      rel: 'noopener noreferrer',
      target: '_blank',
    }),
    img: sanitizeHtml.simpleTransform('img', {
      loading: 'lazy',
    }),
  },
}

const stripHtml = (html) =>
  sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })

export const renderMarkdownToHtml = (value = '') => {
  const rawHtml = markdown.render(String(value || ''))
  return sanitizeHtml(rawHtml, sanitizeOptions)
}

export const markdownToExcerpt = (value = '', maxLength = 180) => {
  const text = stripHtml(renderMarkdownToHtml(value))
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) return 'No summary available yet.'
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}...`
}
