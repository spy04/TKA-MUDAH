
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

type ActionButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never
  }

type LinkButtonProps = BaseProps & {
  to: string
  disabled?: boolean
}

type ButtonProps = ActionButtonProps | LinkButtonProps

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-secondary',
  secondary:
    'bg-muted text-brand hover:bg-stroke',
  outline:
    'border border-stroke bg-card text-foreground hover:bg-muted',
  ghost:
    'bg-transparent text-brand hover:bg-muted',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-xs',
  lg: 'px-5 py-3.5 text-base',
}

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
  } = props

  const styles = [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-heading font-semibold',
    'transition-colors duration-200',
    'disabled:cursor-not-allowed disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    className,
  ].join(' ')

  if (props.to !== undefined) {
    const { to, disabled } = props

    if (disabled) {
      return (
        <span
          aria-disabled="true"
          className={`${styles} cursor-not-allowed opacity-50`}
        >
          {children}
        </span>
      )
    }

    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    )
  }

  const {
    type = 'button',
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...buttonProps
  } = props

  void _variant
  void _size
  void _className
  void _children

  return (
    <button
      type={type}
      className={styles}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
