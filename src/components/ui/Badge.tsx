
import type { HTMLAttributes, ReactNode } from 'react'

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'success'
  | 'warning'
  | 'premium'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  rounded?: 'sm' | 'full'
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    'bg-brand text-white',
  secondary:
    'bg-soft-blue text-brand-secondary',
  muted:
    'bg-muted text-foreground-muted',
  success:
    'bg-emerald-50 text-emerald-700',
  warning:
    'bg-amber-100 text-amber-700',
  premium:
    'bg-brand text-white',
}

export default function Badge({
  children,
  variant = 'muted',
  size = 'sm',
  rounded = 'sm',
  className = '',
  ...props
}: BadgeProps) {
  const styles = [
    'inline-flex items-center justify-center gap-1.5',
    'font-heading font-semibold',
    variantStyles[variant],
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-3 py-1 text-xs',
    rounded === 'full'
      ? 'rounded-full'
      : 'rounded',
    className,
  ].join(' ')

  return (
    <span className={styles} {...props}>
      {children}
    </span>
  )
}
