import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[character],
  )

marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

const renderer = new marked.Renderer()
renderer.checkbox = ({ checked }) =>
  `<input type="checkbox" ${checked ? 'checked' : ''}>`
renderer.code = ({ text, lang, escaped }) => {
  const language = (lang || '').match(/\S*/)?.[0]
  const className = language
    ? ` class="hljs language-${escapeHtml(language)}"`
    : ''
  const code = String(text || '').replace(/\n$/, '')
  const highlightedCode = escaped ? code : escapeHtml(code)

  return `<div class="markdown-code-block"><button type="button" class="markdown-copy-button" data-copy-code aria-label="Copy code to clipboard">Copy</button><pre><code${className}>${highlightedCode}
</code></pre></div>`
}

marked.use({ renderer, gfm: true })

export { marked }
