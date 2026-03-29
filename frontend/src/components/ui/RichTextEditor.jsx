import { useEffect, useRef } from 'react'

import { FiClipboard, FiList, FiRotateCcw, FiType } from 'react-icons/fi'

import { cn } from '@/utils/cn'
import { getRichTextPlainText, sanitizeRichText } from '@/utils/richText'

const toolbarActions = [
  { label: 'B', ariaLabel: 'Aplicar negrita', command: 'bold', className: 'font-extrabold' },
  { label: 'I', ariaLabel: 'Aplicar cursiva', command: 'italic', className: 'italic' },
  { label: 'U', ariaLabel: 'Aplicar subrayado', command: 'underline', className: 'underline' },
  { label: <FiList className="size-4" />, ariaLabel: 'Crear lista con viñetas', command: 'insertUnorderedList' },
  { label: '1.', ariaLabel: 'Crear lista numerada', command: 'insertOrderedList', className: 'text-xs font-semibold' },
]

const baseButtonClassName =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-[rgba(47,93,115,0.14)] bg-white px-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:border-[rgba(47,93,115,0.32)] hover:bg-[rgba(47,93,115,0.06)]'

export const RichTextEditor = ({
  className,
  onChange,
  placeholder = 'Escribí el informe de seguimiento...',
  value,
}) => {
  const editorRef = useRef(null)

  useEffect(() => {
    const editor = editorRef.current

    if (!editor) {
      return
    }

    const sanitizedValue = sanitizeRichText(value)
    const currentValue = sanitizeRichText(editor.innerHTML)

    if (currentValue !== sanitizedValue) {
      editor.innerHTML = sanitizedValue
    }
  }, [value])

  const emitChange = () => {
    const editor = editorRef.current

    if (!editor) {
      return
    }

    onChange(sanitizeRichText(editor.innerHTML))
  }

  const applyCommand = (command) => {
    const editor = editorRef.current

    if (!editor) {
      return
    }

    editor.focus()
    document.execCommand(command, false, undefined)
    emitChange()
  }

  const handlePaste = (event) => {
    event.preventDefault()

    const html = event.clipboardData.getData('text/html')
    const text = event.clipboardData.getData('text/plain')

    if (html) {
      document.execCommand('insertHTML', false, sanitizeRichText(html))
    } else {
      document.execCommand('insertText', false, text)
    }

    emitChange()
  }

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()

      if (!clipboardText) {
        return
      }

      editorRef.current?.focus()
      document.execCommand('insertText', false, clipboardText)
      emitChange()
    } catch {
      editorRef.current?.focus()
    }
  }

  const handleClearFormatting = () => {
    const plainText = getRichTextPlainText(value)
    onChange(plainText)
    editorRef.current?.focus()
  }

  return (
    <div className={cn('overflow-hidden rounded-[1.25rem] border border-[rgba(47,93,115,0.16)] bg-white', className)}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[rgba(47,93,115,0.1)] bg-[rgba(247,244,238,0.72)] px-3 py-3">
        {toolbarActions.map((action) => (
          <button
            key={action.command}
            aria-label={action.ariaLabel}
            className={cn(baseButtonClassName, action.className)}
            onClick={() => applyCommand(action.command)}
            onMouseDown={(event) => event.preventDefault()}
            title={action.ariaLabel}
            type="button"
          >
            {action.label}
          </button>
        ))}
        <button
          aria-label="Pegar texto desde el portapapeles"
          className={baseButtonClassName}
          onClick={handlePasteFromClipboard}
          onMouseDown={(event) => event.preventDefault()}
          title="Pegar texto desde el portapapeles"
          type="button"
        >
          <FiClipboard className="size-4" />
        </button>
        <button
          aria-label="Quitar formato"
          className={baseButtonClassName}
          onClick={handleClearFormatting}
          onMouseDown={(event) => event.preventDefault()}
          title="Quitar formato"
          type="button"
        >
          <FiRotateCcw className="size-4" />
        </button>
        <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-[rgba(47,93,115,0.08)] px-3 py-1 text-xs font-medium text-[rgba(47,93,115,0.78)]">
          <FiType className="size-3.5" />
          {getRichTextPlainText(value).length} caracteres
        </div>
      </div>

      <div
        aria-label="Nota de seguimiento"
        className="rich-text-editor"
        contentEditable
        data-placeholder={placeholder}
        onBlur={emitChange}
        onInput={emitChange}
        onPaste={handlePaste}
        ref={editorRef}
        aria-multiline="true"
        role="textbox"
        suppressContentEditableWarning
      />
    </div>
  )
}
