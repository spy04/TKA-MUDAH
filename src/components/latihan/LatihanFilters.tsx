
import SegmentedControl from '../ui/SegmentedControl'

import type {
  AksesLatihan,
  Jenjang,
  TingkatLatihan,
} from '../../services/latihanService'

export type LatihanFilterState = {
  jenjang: Jenjang
  kelas: string
  akses: 'Semua' | AksesLatihan
  mataPelajaran: string
  tingkat: 'Semua' | TingkatLatihan
}

type LatihanFiltersProps = {
  value: LatihanFilterState
  mataPelajaranOptions: string[]
  onChange: (next: LatihanFilterState) => void
}

const jenjangOptions: {
  value: Jenjang
  label: string
}[] = [
  { value: 'SD', label: 'SD' },
  { value: 'SMP', label: 'SMP' },
  { value: 'SMA', label: 'SMA' },
]

const aksesOptions: {
  value: LatihanFilterState['akses']
  label: string
}[] = [
  { value: 'Semua', label: 'Semua' },
  { value: 'Gratis', label: 'Gratis' },
  { value: 'Premium', label: 'Premium' },
]

const tingkatOptions: {
  value: LatihanFilterState['tingkat']
  color?: string
}[] = [
  { value: 'Semua' },
  { value: 'Mudah', color: 'bg-emerald-500' },
  { value: 'Sedang', color: 'bg-amber-500' },
  { value: 'Sulit', color: 'bg-red-600' },
]

export const gradeOptions: Record<Jenjang, string[]> = {
  SD: ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'],
  SMP: ['Kelas 7', 'Kelas 8', 'Kelas 9'],
  SMA: ['Kelas 10', 'Kelas 11', 'Kelas 12'],
}

export const defaultLatihanFilters: LatihanFilterState = {
  jenjang: 'SMA',
  kelas: 'Kelas 11',
  akses: 'Semua',
  mataPelajaran: 'Semua',
  tingkat: 'Semua',
}

export default function LatihanFilters({
  value,
  mataPelajaranOptions,
  onChange,
}: LatihanFiltersProps) {
  const update = (patch: Partial<LatihanFilterState>) => {
    onChange({ ...value, ...patch })
  }

  function changeJenjang(jenjang: Jenjang) {
    update({
      jenjang,
      kelas:
        jenjang === 'SMA'
          ? 'Kelas 11'
          : gradeOptions[jenjang][0],
    })
  }

  return (
    <section className="flex flex-col gap-5 rounded-xl bg-card p-5 shadow-sm">
      {/* FIRST ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="mr-1 font-heading text-[11px] font-bold uppercase tracking-wider text-[#75777e]">
            Jenjang:
          </span>

          <SegmentedControl
            options={jenjangOptions}
            value={value.jenjang}
            onChange={changeJenjang}
            ariaLabel="Pilih jenjang"
            size="md"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-heading text-[11px] font-bold uppercase tracking-wider text-[#75777e]">
            Kelas:
          </span>

          <div className="flex flex-wrap gap-1.5">
            {gradeOptions[value.jenjang].map((kelas) => {
              const active = value.kelas === kelas

              return (
                <button
                  key={kelas}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ kelas })}
                  className={`rounded-lg px-3 py-1.5 font-heading text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-brand text-white shadow-sm'
                      : 'bg-muted text-foreground-muted hover:bg-stroke hover:text-foreground'
                  }`}
                >
                  {kelas}
                </button>
              )
            })}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="mr-1 font-heading text-[11px] font-bold uppercase tracking-wider text-[#75777e]">
            Akses:
          </span>

          <SegmentedControl
            options={aksesOptions}
            value={value.akses}
            onChange={(akses) => update({ akses })}
            ariaLabel="Filter akses latihan"
            size="sm"
          />
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="-mx-5 -mb-5 flex flex-col items-start justify-between gap-4 rounded-b-xl bg-muted/50 px-5 py-4 xl:flex-row xl:items-center">
        <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 xl:w-auto xl:pb-0">
          <span className="mr-1 shrink-0 font-heading text-[11px] font-bold uppercase tracking-wider text-[#75777e]">
            Mapel:
          </span>

          {['Semua', ...mataPelajaranOptions].map((mapel) => {
            const active = value.mataPelajaran === mapel

            return (
              <button
                key={mapel}
                type="button"
                aria-pressed={active}
                onClick={() => update({ mataPelajaran: mapel })}
                className={`shrink-0 rounded-full px-3 py-1 font-heading text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-soft-blue text-brand shadow-sm'
                    : 'bg-card text-foreground-muted hover:bg-stroke hover:text-foreground'
                }`}
              >
                {mapel === 'Semua'
                  ? 'Semua Mata Pelajaran'
                  : mapel}
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end xl:self-auto">
          <span className="mr-1 font-heading text-[11px] font-bold uppercase tracking-wider text-[#75777e]">
            Tingkat:
          </span>

          <div className="inline-flex gap-1.5">
            {tingkatOptions.map((option) => {
              const active = value.tingkat === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    update({ tingkat: option.value })
                  }
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 font-heading text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-brand text-white'
                      : 'bg-card text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {option.color && (
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        option.color
                      }`}
                    />
                  )}

                  {option.value}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
