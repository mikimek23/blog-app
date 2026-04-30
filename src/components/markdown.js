import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

// Fix 2: Syntax highlighting
marked.use(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

// Fix 1: Interactive checklists (remove the `disabled` attribute)
const renderer = new marked.Renderer()
renderer.checkbox = ({ checked }) =>
  `<input type="checkbox" ${checked ? 'checked' : ''}>`

marked.use({ renderer, gfm: true })

export { marked }
