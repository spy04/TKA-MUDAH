
import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import MateriCard from '../components/materi/MateriCard'
import MateriFilters from '../components/materi/MateriFilters'
import MateriPagination from '../components/materi/MateriPagination'
import SearchInput from '../components/ui/SearchInput'

import {
  getMateri,
  type KatalogData,
} from '../services/materiService'

const PAGE_SIZE = 6

export default function JelajahiMateri() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryFromUrl = searchParams.get('q') ?? ''
  const [data, setData] = useState<KatalogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  /* Filter state */
  const [jenjang, setJenjang] = useState('semua')
  const [akses, setAkses] = useState('semua')
  const [mataPelajaran, setMataPelajaran] = useState('semua')
  const [urutan, setUrutan] = useState('relevan')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(queryFromUrl)
  const [submittedSearch, setSubmittedSearch] = useState(queryFromUrl)

  /* =====================================
     LOAD DATA
  ===================================== */

  useEffect(() => {
    setSearch(queryFromUrl)
    setSubmittedSearch(queryFromUrl)
    setPage(1)
  }, [queryFromUrl])

  useEffect(() => {
    let active = true

    async function loadCatalog() {
      setLoading(true)
      setError('')
      try {
        const result = await getMateri({
          q: submittedSearch,
          jenjang,
          akses,
          mataPelajaran,
          urutan,
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
              : 'Gagal memuat katalog materi.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      active = false
    }
  }, [submittedSearch, jenjang, akses, mataPelajaran, urutan, page])

  /* =====================================
     FILTER HANDLERS
  ===================================== */

  function changeJenjang(value: string) {
    setJenjang(value)
    setPage(1)
  }

  function changeAkses(value: string) {
    setAkses(value)
    setPage(1)
  }

  function changeSubject(value: string) {
    setMataPelajaran(value)
    setPage(1)
  }

  function changeSort(value: string) {
    setUrutan(value)
    setPage(1)
  }

  function resetFilters() {
    setJenjang('semua')
    setAkses('semua')
    setMataPelajaran('semua')
    setUrutan('relevan')
    setSearch('')
    setSubmittedSearch('')
    setSearchParams({})
    setPage(1)
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    setSubmittedSearch(query)
    setPage(1)
    if (query) setSearchParams({ q: query })
    else setSearchParams({})
  }

  /* =====================================
     LOADING / ERROR
  ===================================== */

  if (loading) {
    return (
      <div
        role="status"
        className="mx-auto max-w-7xl px-4 py-12 text-sm text-foreground-muted"
      >
        Memuat katalog materi...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl px-4 py-12 text-sm text-red-600"
      >
        {error || 'Gagal memuat katalog materi.'}
      </div>
    )
  }

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 md:py-10 lg:px-8">

      {/* PAGE HEADING */}
      <section className="mb-8 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 font-heading text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
          <span>Kurikulum Merdeka</span>

          <ChevronRight
            size={14}
            className="text-[#75777e]"
          />

          <span className="font-semibold text-brand-secondary">
            Katalog Modul Pembelajaran
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-heading text-[28px] font-bold leading-9 tracking-tight text-brand">
              Jelajahi Materi & Modul Pelajaran
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-[22px] text-foreground-muted">
              Akses kurikulum terstandarisasi untuk jenjang SD,
              SMP, hingga persiapan intensif SMA/UTBK dengan
              penyusunan materi komprehensif.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-[13px] text-foreground-muted shadow-sm">
            <ShieldCheck
              size={18}
              className="text-brand-secondary"
            />

            <span>
              {data.total} Modul Pelajaran Tersedia
            </span>
          </div>
        </div>
      </section>

      <form
        onSubmit={handleSearch}
        className="mb-5 flex max-w-2xl items-center gap-2"
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={() => {
            setSearch('')
            setSubmittedSearch('')
            setPage(1)
            setSearchParams({})
          }}
          placeholder="Cari judul atau deskripsi materi..."
          aria-label="Cari materi"
          containerClassName="min-w-0 flex-1 bg-card"
        />
        <Button type="submit" className="shrink-0">
          Cari
        </Button>
      </form>

      {/* FILTERS */}
      <MateriFilters
        jenjangOptions={data.jenjang}
        aksesOptions={data.akses}
        subjectOptions={data.mataPelajaran}
        sortOptions={data.urutan}
        jenjang={jenjang}
        akses={akses}
        mataPelajaran={mataPelajaran}
        urutan={urutan}
        onJenjangChange={changeJenjang}
        onAksesChange={changeAkses}
        onSubjectChange={changeSubject}
        onSortChange={changeSort}
      />

      {/* MATERIAL GRID */}
      {data.materi.length > 0 ? (
        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.materi.map((item) => (
            <MateriCard
              key={item.id}
              item={item}
            />
          ))}
        </section>
      ) : (
        <section className="mb-10 rounded-xl bg-card px-6 py-14 text-center shadow-sm">
          <BookOpen
            size={32}
            className="mx-auto text-brand-secondary"
          />

          <h2 className="mt-3 font-heading text-base font-semibold text-brand">
            Materi tidak ditemukan
          </h2>

          <p className="mt-2 text-sm text-foreground-muted">
            Tidak ada materi untuk kombinasi filter yang dipilih.
          </p>

          <Button
            type="button"
            onClick={resetFilters}
            size="sm"
            className="mt-4"
          >
            Tampilkan Semua Materi
          </Button>
        </section>
      )}

      {/* PAGINATION */}
      <MateriPagination
        currentPage={data.page}
        totalItems={data.total}
        pageSize={data.pageSize}
        onPageChange={setPage}
      />

      {/* EDUCATIONAL NOTICE */}
      <section className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-muted p-4 text-foreground-muted sm:flex-row">
        <div className="flex items-center gap-3">
          <ShieldCheck
            size={20}
            className="shrink-0 text-brand-secondary"
          />

          <p className="text-[13px]">
            Materi pelajaran dan kurikulum disusun secara
            terstruktur untuk pendampingan belajar mandiri.
          </p>
        </div>

        <Link
          to="/kurikulum"
          className="inline-flex shrink-0 items-center gap-1 font-heading text-xs font-semibold text-brand-secondary transition-colors hover:text-brand"
        >
          Pelajari Capaian Pembelajaran
          <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  )
}
