import { describe, expect, test } from '@jest/globals'
import { markdownToExcerpt, renderMarkdownToHtml } from '../utils/markdown.js'

describe('markdown rendering', () => {
  test('renders headings, code blocks, and images', () => {
    const html = renderMarkdownToHtml(`
# Hello

\`\`\`js
console.log('hi')
\`\`\`

![Alt text](https://example.com/image.png)
`)

    expect(html).toContain('<h1>Hello</h1>')
    expect(html).toContain('<pre><code class="language-js">')
    expect(html).toContain('src="https://example.com/image.png"')
    expect(html).toContain('alt="Alt text"')
  })

  test('does not render unsafe html or image urls', () => {
    const html = renderMarkdownToHtml(`
<script>alert('xss')</script>

![Bad](javascript:alert('xss'))
`)

    expect(html).not.toContain('<script>')
    expect(html).not.toContain('src="javascript:')
    expect(html).not.toContain('<img')
  })

  test('creates plain text excerpts', () => {
    expect(markdownToExcerpt('## Title\n\nA **bold** note.')).toBe(
      'Title A bold note.',
    )
  })
})
