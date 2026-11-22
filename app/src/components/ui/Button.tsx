import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'subtle'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary:
    'bg-acid text-ink font-semibold hover:bg-[#d8ff82] active:scale-[0.98] border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.4),0_0_12px_rgba(200,245,107,0.25)] transition-all',
  secondary:
    'bg-surface text-paper hover:bg-surface-2 hover:border-line-strong active:scale-[0.98] border border-line shadow-sm transition-all',
  outline:
    'bg-transparent text-paper hover:bg-surface active:scale-[0.98] border border-line-strong hover:border-line-strong transition-all',
  subtle:
    'bg-ink-raised text-muted hover:text-paper hover:bg-surface active:scale-[0.98] border border-line/60 transition-all',
  ghost:
    'bg-transparent text-muted hover:text-paper hover:bg-surface/80 border border-transparent transition-all',
  danger:
    'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 active:scale-[0.98] transition-all',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-2.5 text-[11.5px] gap-1.5 rounded-lg font-medium',
  md: 'h-9 px-3.5 text-[12.5px] gap-2 rounded-lg font-medium',
  lg: 'h-10.5 px-4.5 text-[13.5px] gap-2.5 rounded-xl font-medium',
  icon: 'size-8.5 p-0 rounded-lg justify-center',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
}

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  icon,
  iconRight,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center font-sans tracking-[-0.01em] transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 cursor-pointer',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
}

export function buttonStyles({
  variant = 'secondary',
  size = 'md',
  className,
}: {
  variant?: Variant
  size?: Size
  className?: string
}) {
  return cn(
    'inline-flex select-none items-center justify-center font-medium tracking-[-0.01em] transition-all duration-150 active:scale-[0.98]',
    variants[variant],
    sizes[size],
    className,
  )
}
