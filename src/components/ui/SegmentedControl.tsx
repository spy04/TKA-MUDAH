
export type SegmentedOption<T extends string> = {
  label: string
  value: T
  disabled?: boolean
}

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  size?: 'sm' | 'md'
  className?: string
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = 'sm',
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1 ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={[
              'shrink-0 rounded font-heading transition-colors',
              'disabled:cursor-not-allowed disabled:opacity-50',
              size === 'sm'
                ? 'px-2.5 py-1 text-[11px]'
                : 'px-3 py-1.5 text-xs',
              active
                ? 'bg-card font-semibold text-brand shadow-sm'
                : 'font-medium text-foreground-muted hover:text-foreground',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
