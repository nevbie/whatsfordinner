import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react'

/**
 * Text input that saves on blur / Enter instead of on every keystroke, so typing stays smooth
 * while the value syncs to the other phones.
 */
export function TextField({ value, onCommit, multiline, ...rest }: { value: string; onCommit(v: string): void; multiline?: boolean } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const [draft, setDraft] = useState(value)
  const focused = useRef(false)
  useEffect(() => {
    if (!focused.current) setDraft(value)
  }, [value])
  const commit = () => {
    focused.current = false
    if (draft !== value) onCommit(draft)
  }
  const common = {
    value: draft,
    onFocus: () => (focused.current = true),
    onBlur: commit,
  }
  if (multiline) return <textarea rows={2} {...common} placeholder={rest.placeholder} aria-label={rest['aria-label']} onChange={(e) => setDraft(e.target.value)} />
  return <input {...rest} {...common} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()} />
}
