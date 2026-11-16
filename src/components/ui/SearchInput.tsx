
import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value' | 'onChange'
> & {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  showShortcut?: boolean
  containerClassName?: string
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      value,
      onChange,
      onClear,
      showShortcut = false,
      containerClassName = '',
      className = '',
      placeholder = 'Cari...',
      ...inputProps
    },
    ref
  ) {
    return (
      <div
        className={[
          'flex w-full items-center gap-2',
          'rounded-lg bg-muted px-3 py-2',
          'focus-within:bg-card',
          containerClassName,
        ].join(' ')}
      >
        <Search
          size={18}
          className="shrink-0 text-foreground-light"
        />

        <input
          {...inputProps}
          ref={ref}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={[
            'min-w-0 flex-1 bg-transparent',
            'text-[13px] text-foreground outline-none',
            'placeholder:text-foreground-light',
            className,
          ].join(' ')}
        />

        {value ? (
          onClear && (
            <button
              type="button"
              aria-label="Hapus pencarian"
              onClick={onClear}
              className="shrink-0 text-foreground-muted hover:text-foreground"
            >
              <X size={15} />
            </button>
          )
        ) : (
          showShortcut && (
            <kbd className="hidden shrink-0 rounded border border-stroke bg-card px-1.5 py-0.5 text-[10px] text-foreground-muted sm:inline">
              Ctrl+K
            </kbd>
          )
        )}
      </div>
    )
  }
)

export default SearchInput
