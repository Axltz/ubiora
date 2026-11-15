import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  className?: string
}) {
  const active = value !== options[0]
  return (
    <label
      className={cn(
        'relative flex h-8 items-center gap-2 rounded-lg border bg-panel pl-2.5 pr-7 transition-colors',
        active ? 'border-acid/30' : 'border-line hover:border-line-strong',
        className,
      )}
    >
      <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-dim">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'max-w-[140px] cursor-pointer appearance-none bg-transparent text-[11px] outline-none',
          active ? 'text-paper' : 'text-muted',
        )}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-panel text-paper">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 size-3 text-dim" />
    </label>
  )
}
