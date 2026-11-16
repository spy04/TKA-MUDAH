
type ProgressVariant =
  | 'primary'
  | 'secondary'
  | 'success'

type ProgressBarProps = {
  value: number
  max?: number
  label?: string
  variant?: ProgressVariant
  size?: 'sm' | 'md'
  showValue?: boolean
  className?: string
}

const variantStyles: Record<ProgressVariant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-brand-secondary',
  success: 'bg-emerald-600',
}

export default function ProgressBar({
  value,
  max = 100,
  label = 'Progres',
  variant = 'secondary',
  size = 'md',
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100

  const safeValue = Math.min(
    safeMax,
    Math.max(0, Number.isFinite(value) ? value : 0)
  )

  const percentage = (safeValue / safeMax) * 100

  return (
    <div className={className}>
      {showValue && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-foreground-muted">
            {label}
          </span>

          <span className="font-semibold text-brand">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        className={`w-full overflow-hidden rounded-full bg-stroke ${
          size === 'sm' ? 'h-1' : 'h-1.5'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            variantStyles[variant]
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
