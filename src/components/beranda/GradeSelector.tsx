
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '../ui/Badge'
import type { Level } from '../../services/berandaService'

type GradeOption = {
  value: Level
  grade: string
  phase: string
}

const levels: GradeOption[] = [
  {
    value: 'SD',
    grade: 'Kelas 1–6',
    phase: 'Tersedia untuk Fase A, B & C (SD)',
  },
  {
    value: 'SMP',
    grade: 'Kelas 7–9',
    phase: 'Tersedia untuk Fase D (SMP)',
  },
  {
    value: 'SMA',
    grade: 'Kelas 10–12',
    phase: 'Tersedia untuk Fase E & F (SMA)',
  },
]

type GradeSelectorProps = {
  value: Level
  onChange: (value: Level) => void
}

export default function GradeSelector({
  value,
  onChange,
}: GradeSelectorProps) {
  const selectedLevel = levels.find(
    (item) => item.value === value
  )

  return (
    <section className="flex flex-col justify-between rounded-xl border border-home-border bg-card p-4 shadow-sm sm:p-5">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-home-muted">
            Pilih Jenjang
          </h2>

          <span className="text-[11px] font-medium text-home-accent">
            Pilihan Jenjang
          </span>
        </div>

        <div
          role="group"
          aria-label="Pilih jenjang pendidikan"
          className="grid grid-cols-3 gap-2"
        >
          {levels.map((item) => {
            const active = value === item.value

            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(item.value)}
                className={`relative rounded-lg border px-2 py-2.5 text-center transition-colors ${
                  active
                    ? 'border-home-accent bg-home-accent-soft shadow-sm'
                    : 'border-home-border bg-home-subtle hover:bg-slate-200'
                }`}
              >
                <span
                  className={`block text-xs font-bold ${
                    active
                      ? 'text-home-accent'
                      : 'text-home-text'
                  }`}
                >
                  {item.value}
                </span>

                <span
                  className={`text-[10px] ${
                    active
                      ? 'font-medium text-home-accent'
                      : 'text-home-muted'
                  }`}
                >
                  {item.grade}
                </span>

                {active && (
                  <Badge
                    variant="primary"
                    className="absolute -right-1 -top-1.5 bg-home-accent px-1 py-0.5 text-[9px] text-white"
                  >
                    Aktif
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-home-border pt-3 text-xs">
        <span className="text-home-muted">
          {selectedLevel?.phase}
        </span>

        <Link
          to="/materi"
          className="flex items-center gap-0.5 font-medium text-home-accent hover:underline"
        >
          Ubah Kelas
          <ChevronRight size={14} />
        </Link>
      </div>
    </section>
  )
}
