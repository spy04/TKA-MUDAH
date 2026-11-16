
import { useEffect, useState, type FormEvent } from 'react'
import {
  Lightbulb,
  RotateCcw,
  SearchX,
} from 'lucide-react'

import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import SearchInput from '../components/ui/SearchInput'

import MateriPagination from '../components/materi/MateriPagination'
import LatihanCard from '../components/latihan/LatihanCard'
import LatihanFilters, {
  defaultLatihanFilters,
  type LatihanFilterState,
} from '../components/latihan/LatihanFilters'

import {
  getLatihanData,
  type PaketKind,
  type LatihanData,
} from '../services/latihanService'
import { useSearchParams } from 'react-router-dom'

const PAGE_SIZE = 6

export default function LatihanSoal() {
  const [searchParams] = useSearchParams()
  const kind: PaketKind =
    searchParams.get('kind') === 'SIMULATION' ? 'SIMULATION' : 'PRACTICE'
  const [data, setData] = useState<LatihanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState<LatihanFilterState>({
    ...defaultLatihanFilters,
  })

  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [page, setPage] = useState(1)

  /* =====================================
     LOAD DATA
  ===================================== */

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      setError('')
      try {
        const result = await getLatihanData({
          ...filters,
          q: submittedSearch,
          kind,
          page,
          pageSize: PAGE_SIZE,
        })

        if (active) {
          setData(result)
        }
      } catch (caught) {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Gagal memuat daftar latihan soal.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadData()

    return () => {
      active = false
    }
  }, [filters, submittedSearch, page, kind])

  /* =====================================
     HANDLERS
  ===================================== */

  function handleFilterChange(next: LatihanFilterState) {
    setFilters(next)
    setPage(1)
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedSearch(search.trim())
    setPage(1)
  }

  function resetFilters() {
    setFilters({ ...defaultLatihanFilters })
    setSearch('')
    setSubmittedSearch('')
    setPage(1)
  }

  /* =====================================
     LOADING / ERROR
  ===================================== */

  if (loading) {
    return (
      <div
        role="status"
        className="mx-auto max-w-7xl px-6 py-12 text-sm text-foreground-muted"
      >
        Memuat paket latihan...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl px-6 py-12 text-sm text-red-600"
      >
        {error || 'Gagal memuat daftar latihan soal.'}
      </div>
    )
  }

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div className="w-full">
      {/* PAGE HEADER */}
      <section className="w-full bg-card shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-brand-secondary">
              Kurikulum Merdeka & Nasional
            </span>

            <span className="text-stroke">•</span>

            <span className="font-heading text-[11px] font-medium text-foreground-muted">
              {kind === 'SIMULATION' ? 'Simulasi Ujian' : 'Bank Soal Terstruktur'}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-heading text-[40px] font-bold leading-[48px] tracking-tight text-brand">
                {kind === 'SIMULATION' ? 'Simulasi Ujian' : 'Latihan Soal'}
              </h1>

              <p className="mt-1.5 max-w-2xl text-base leading-[26px] text-foreground-muted">
                Pilih paket sesuai mata pelajaran dan kelasmu.
                Jawaban akan disimpan dan dinilai melalui sistem ujian.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-md items-center gap-2 lg:w-auto"
            >
              <SearchInput
                value={search}
                onChange={setSearch}
                onClear={() => {
                  setSearch('')
                  setSubmittedSearch('')
                  setPage(1)
                }}
                placeholder="Cari bab, topik, atau mata pelajaran..."
                aria-label="Cari paket latihan"
                containerClassName="min-w-0 flex-1 bg-muted shadow-sm"
                className="text-sm"
              />

              <Button
                type="submit"
                variant="primary"
                className="shrink-0 bg-brand px-5 py-2.5 shadow-sm hover:bg-brand-dark"
              >
                Cari
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* FILTER PANEL */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-2 pt-6 sm:px-6 lg:px-8">
        <LatihanFilters
          value={filters}
          mataPelajaranOptions={data.mataPelajaran}
          onChange={handleFilterChange}
        />
      </div>

      {/* MAIN CATALOG */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-base font-bold text-brand">
              Daftar Paket Latihan
            </h2>

            <Badge
              variant="muted"
              rounded="full"
              className="bg-stroke text-foreground-muted"
            >
              {filters.jenjang} {filters.kelas} • {data.total} Paket Tersedia
            </Badge>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-[13px] font-medium text-brand-secondary transition-colors hover:text-brand"
          >
            <RotateCcw size={16} />
            Reset Filter
          </button>
        </div>

        {data.paket.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.paket.map((item) => (
              <LatihanCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <section className="my-6 flex flex-col items-center justify-center rounded-xl bg-card px-6 py-16 text-center shadow-sm">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-foreground-muted">
              <SearchX size={32} />
            </span>

            <h3 className="mb-2 font-heading text-lg font-bold text-brand">
              Tidak Ada Paket Latihan
            </h3>

            <p className="mb-6 max-w-md text-sm leading-[22px] text-foreground-muted">
              Tidak ada paket latihan yang sesuai dengan
              filter yang dipilih. Silakan sesuaikan kriteria
              atau reset filter Anda.
            </p>

            <Button
              type="button"
              onClick={resetFilters}
              className="gap-2 bg-brand px-5 py-2.5"
            >
              <RotateCcw size={18} />
              Reset Filter
            </Button>
          </section>
        )}

        {/* PAGINATION */}
        {data.total > 0 && (
          <div className="mt-10">
            <MateriPagination
              currentPage={data.page}
              totalItems={data.total}
              pageSize={data.pageSize}
              onPageChange={setPage}
            />
          </div>
        )}

        {/* EDUCATIONAL BANNER */}
        <section className="mb-4 mt-8 flex items-center gap-4 rounded-xl bg-muted p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-soft-blue text-brand">
            <Lightbulb size={26} />
          </span>

          <div>
            <h2 className="font-heading text-base font-semibold text-brand">
              Belajar Mandiri Berkelanjutan
            </h2>

            <p className="mt-0.5 text-[13px] leading-[18px] text-foreground-muted">
              Jawaban dan hasil setiap attempt tersimpan melalui sistem.
              Pembahasan tersedia setelah attempt selesai jika disediakan
              untuk soal tersebut.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
