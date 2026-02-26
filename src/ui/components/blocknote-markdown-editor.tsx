import { useEffect, useRef } from 'react'
import { zh } from '@blocknote/core/locales'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { cn } from '@/shared/cn'

export function BlocknoteMarkdownEditor({
  markdown,
  loadToken,
  onMarkdownChange,
  className,
}: {
  markdown: string
  loadToken: number
  onMarkdownChange: (value: string) => void
  className?: string
}) {
  const editor = useCreateBlockNote({
    dictionary: {
      ...zh,
      placeholders: {
        ...zh.placeholders,
        default: '请输入简历内容，输入 / 可插入内容块',
        emptyDocument: '请输入简历内容，输入 / 可插入内容块',
      },
    },
  })
  const lastMarkdownRef = useRef('')

  useEffect(() => {
    if ((markdown || '') === lastMarkdownRef.current) {
      return
    }
    const parsed = editor.tryParseMarkdownToBlocks(markdown || '')
    const blocks = parsed.length > 0 ? parsed : [{ type: 'paragraph' as const }]
    editor.replaceBlocks(editor.document, blocks)
    const next = editor.blocksToMarkdownLossy(editor.document)
    lastMarkdownRef.current = next
  }, [editor, markdown, loadToken])

  return (
    <div className={cn('overflow-hidden rounded-lg border border-input bg-white', className)}>
      <BlockNoteView
        editor={editor}
        theme="light"
        formattingToolbar={false}
        linkToolbar={false}
        sideMenu={false}
        className="min-h-[320px] [&_.bn-editor]:bg-white"
        onChange={() => {
          const next = editor.blocksToMarkdownLossy(editor.document)
          if (next === lastMarkdownRef.current) return
          lastMarkdownRef.current = next
          onMarkdownChange(next)
        }}
      />
    </div>
  )
}
