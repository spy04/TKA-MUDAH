
import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownWideNarrow,
  ChevronDown,
} from 'lucide-react'

import SegmentedControl from '../ui/SegmentedControl'

import type {
  FilterOption,
} from '../../services/materiService'

type MateriFiltersProps = {
  jenjangOptions: FilterOption[]
  aksesOptions: FilterOption[]
  subjectOptions: FilterOption[]
  sortOptions: FilterOption[]

  jenjang: string
  akses: string
  mataPelajaran: string
  urutan: string

  onJenjangChange: (value: string) => void
  onAksesChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onSortChange: (value: string) => void
}

export default function MateriFilters({
  jenjangOptions,
  aksesOptions,
  subjectOptions,
  sortOptions,
  jenjang,
  akses,
  mataPelajaran,
  urutan,
  onJenjangChange,
  onAksesChange,
  onSubjectChange,
  onSortChange,
}: MateriFiltersProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const selectedSort =
    sortOptions.find((item) => item.value === urutan)?.label ??
    'Paling Relevan'

  useEffect(() => {
    if (!sortOpen) return

    function handleOutsideClick(event: MouseEvent) {
      if (
        sortRef.current &&
        !sortRef.current.contains(event.target as Node)
      ) {
        setSortOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSortOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [sortOpen])

  function selectSort(value: string) {
    onSortChange(value)
    setSortOpen(false)
  }

  return (
    <section className="mb-8 flex flex-col gap-5 rounded-xl bg-card p-5 shadow-sm md:p-6">
      {/* Row 1 */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <SegmentedControl
          options={jenjangOptions}
          value={jenjang}
          onChange={onJenjangChange}
          ariaLabel="Filter jenjang"
          size="md"
          className="w-fit gap-1.5"
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Access */}
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <span className="hidden px-2.5 font-heading text-[11px] font-bold text-foreground-muted sm:inline">
              Akses:
            </span>

            <SegmentedControl
              options={aksesOptions}
              value={akses}
              onChange={onAksesChange}
              ariaLabel="Filter akses materi"
              size="sm"
              className="max-w-full bg-transparent p-0"
            />
          </div>

          {/* Sorting */}
          <div ref={sortRef} className="relative">
            <button
              type="button"
              aria-expanded={sortOpen}
              aria-haspopup="true"
              onClick={() => setSortOpen((value) => !value)}
              className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-[13px] text-foreground shadow-sm transition-colors hover:bg-[#eceef0]"
            >
              <ArrowDownWideNarrow
                size={18}
                className="text-foreground-muted"
              />

              <span>Urutkan: {selectedSort}</span>

              <ChevronDown
                size={16}
                className="text-[#75777e]"
              />
            </button>

            {sortOpen && (
              <div
                role="group"
                aria-label="Pilihan pengurutan"
                className="absolute right-0 top-full z-30 mt-1.5 w-56 rounded-xl bg-card py-1 shadow-xl"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={urutan === option.value}
                    onClick={() => selectSort(option.value)}
                    className={`w-full px-4 py-2 text-left text-[13px] transition-colors hover:bg-muted ${
                      urutan === option.value
                        ? 'font-semibold text-brand'
                        : 'text-foreground-muted'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Subject Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
        <span className="mr-1 shrink-0 font-heading text-[11px] font-bold text-foreground-muted">
          Mata Pelajaran:
        </span>

        {subjectOptions.map((option) => {
          const active = mataPelajaran === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onSubjectChange(option.value)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-heading text-xs font-semibold transition-all ${
                active
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-muted text-foreground-muted hover:bg-[#eceef0] hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
