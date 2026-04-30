import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useMemo } from 'react'
import { uploadAdminPostImage } from '../../api/posts.js'
import { useTheme } from '../../hooks/useTheme.js'

const codeBlockLanguages = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  markdown: 'Markdown',
  ts: 'TypeScript',
  tsx: 'TSX',
  py: 'python',
}

const createPlugins = () => [
  headingsPlugin(),
  listsPlugin(),
  quotePlugin(),
  thematicBreakPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
  codeMirrorPlugin({ codeBlockLanguages }),
  imagePlugin({
    imageUploadHandler: async (file) => {
      const uploaded = await uploadAdminPostImage(file)
      return uploaded.imageUrl
    },
  }),
  diffSourcePlugin({ viewMode: 'rich-text' }),
  markdownShortcutPlugin(),
  toolbarPlugin({
    toolbarContents: () => (
      <DiffSourceToggleWrapper options={['rich-text', 'source']}>
        <UndoRedo />
        <Separator />
        <BoldItalicUnderlineToggles />
        <CodeToggle />
        <Separator />
        <BlockTypeSelect />
        <ListsToggle />
        <Separator />
        <CreateLink />
        <InsertImage />
        <InsertTable />
        <InsertThematicBreak />
        <InsertCodeBlock />
      </DiffSourceToggleWrapper>
    ),
  }),
]

export const MarkdownEditor = ({ value, onChange, readOnly = false }) => {
  const plugins = useMemo(() => createPlugins(), [])
  const { resolvedTheme } = useTheme()

  return (
    <MDXEditor
      markdown={value || ''}
      onChange={(markdown) => onChange(markdown)}
      readOnly={readOnly}
      plugins={plugins}
      className={`markdown-editor ui-surface-soft ${
        resolvedTheme === 'dark' ? 'dark-theme' : ''
      }`}
      contentEditableClassName='markdown-editor-content'
    />
  )
}
