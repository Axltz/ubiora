import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary:
    'bg-acid text-ink hover:bg-[#d5ff7f] active:bg-acid-dim border border-transparent shadow-[0_0_0_1px_rgba(200,245,107,0.18)]',
  secondary:
    'bg-surface text-paper hover:bg-surface-2 hover:border-line-strong active:bg-surface border border-line',
  ghost: 'bg-transparent text-muted hover:text-paper hover:bg-surface border border-transparent',
  danger:
    'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/15 active:bg-danger/20',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12px] gap-1.5 rounded-lg',
  md: 'h-9.5 px-3.5 text-[13px] gap-2 rounded-lg',
  lg: 'h-11 px-5 text-[13px] gap-2 rounded-[10px]',
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
        'inline-flex select-none items-center justify-center font-medium tracking-[-0.01em] transition-all duration-150 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-40',
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
    'inline-flex select-none items-center justify-center font-medium tracking-[-0.01em] transition-all duration-150 active:scale-[0.985]',
    variants[variant],
    sizes[size],
    className,
  )
}
