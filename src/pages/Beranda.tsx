
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock3,
  PlayCircle,
  RotateCcw,
  Search,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import Button from '../components/ui/Button'
import SearchInput from '../components/ui/SearchInput'

import LearningCard from '../components/beranda/LearningCard'
import FeaturedCard from '../components/beranda/FeaturedCard'
import GradeSelector from '../components/beranda/GradeSelector'
import QuickActionCard from '../components/beranda/QuickActionCard'
import BerandaSkeleton from '../components/beranda/BerandaSkeleton'
import {
  getBerandaData,
  type BerandaData,
  type Level,
} from '../services/berandaService'

export default function Beranda() {
  const [data, setData] = useState<BerandaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [selectedLevel, setSelectedLevel] = useState<Level>('SMA')
  const [filterLevel, setFilterLevel] = useState<Level | null>(null)

  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  /* =====================================
     LOAD DATA
  ===================================== */

  useEffect(() => {
    let active = true

    async function loadBeranda() {
      try {
        const result = await getBerandaData()

        if (active) {
          setData(result)
          setSelectedLevel(result.student.level)
          setError(false)
        }
      } catch {
        if (active) setError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadBeranda()

    return () => {
      active = false
    }
  }, [])

  /* =====================================
     FILTERS
  ===================================== */

  const filteredLearning = useMemo(() => {
    if (!data) return []

    return data.learning.filter((item) => {
      return filterLevel === null || item.level === filterLevel
    })
  }, [data, filterLevel])

  const filteredFeatured = useMemo(() => {
    if (!data) return []

    return data.featured.filter((item) => {
      return filterLevel === null || item.level === filterLevel
    })
  }, [data, filterLevel])

  /* =====================================
     HANDLERS
  ===================================== */

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/materi?q=${encodeURIComponent(query)}` : '/materi')
  }

  function handleLevelChange(value: Level) {
    setSelectedLevel(value)
    setFilterLevel(value)
  }

  function handleReset() {
    setSearch('')
    setFilterLevel(null)

    if (data) {
      setSelectedLevel(data.student.level)
    }
  }

  /* =====================================
     LOADING / ERROR
  ===================================== */

  if (loading) {
  return <BerandaSkeleton />
}

  if (error || !data) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl px-4 py-12 text-sm text-red-600"
      >
        Gagal memuat data Beranda.
      </div>
    )
  }

  const isFiltering = filterLevel !== null

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 md:py-8">

      {/* =====================================
          1. WELCOME & SEARCH
      ===================================== */}

      <section className="rounded-xl border border-home-border bg-card p-5 shadow-sm md:p-6">
        <div className="max-w-3xl">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-home-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span>
              Ruang Belajar Mandiri Siswa
            </span>
          </div>

          <h1 className="font-heading text-xl font-bold tracking-tight text-brand sm:text-2xl md:text-3xl">
            Halo {data.student.firstName}, mau belajar apa hari ini?
          </h1>

          <form
            onSubmit={handleSearch}
            className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              onClear={() => setSearch('')}
              placeholder="Cari mata pelajaran, rumus, bab, atau materi pelajaran..."
              aria-label="Cari materi pembelajaran"
              containerClassName="min-w-0 flex-1 border border-home-border bg-home-subtle py-0 focus-within:border-home-accent focus-within:bg-white"
              className="h-10 text-sm text-home-text placeholder:text-home-muted"
            />

            <Button
              type="submit"
              size="md"
              className="h-10 shrink-0 bg-brand px-5 text-xs hover:bg-home-primary-light"
            >
              Cari Materi
              <ArrowRight size={16} />
            </Button>
          </form>

        </div>
      </section>

      {/* =====================================
          2. GRADE & QUICK ACTIONS
      ===================================== */}

      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <GradeSelector
            value={selectedLevel}
            onChange={handleLevelChange}
          />
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          <QuickActionCard
            title="Latihan Soal Mandiri"
            description="Buka Bank Soal Bab"
            badge="Paket tersedia"
            icon={BookOpen}
            to="/latihan"
            variant="blue"
          />

          <QuickActionCard
            title="Persiapan Ujian & Try Out"
            description="Mulai Ujian Simulasi"
            badge="Dinilai oleh sistem"
            icon={Clock3}
            to="/ujian"
            variant="navy"
          />
        </section>
      </div>

      {/* =====================================
          3. CONTINUE LEARNING
      ===================================== */}

      <section>
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <PlayCircle
              size={20}
              className="text-home-accent"
            />

            <h2 className="font-heading text-base font-bold text-brand">
              Lanjutkan Belajar
            </h2>
          </div>

          <Link
            to="/dashboard"
            className="flex items-center gap-0.5 text-xs font-medium text-home-accent hover:underline"
          >
            Lihat Semua Riwayat
            <ChevronRight size={14} />
          </Link>
        </div>

        {filteredLearning.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredLearning.map((item) => (
              <LearningCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-home-border bg-card p-5 text-sm text-home-muted">
            Tidak ada riwayat belajar yang cocok dengan filter.
          </div>
        )}
      </section>

      {/* =====================================
          4. FEATURED MATERIALS
      ===================================== */}

      <section>
        <div className="mb-3.5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-bold text-brand">
              Materi yang Tersedia
            </h2>

            <p className="mt-1 text-xs text-home-muted">
              Materi yang dipublikasikan di katalog TKA Mudah.
            </p>
          </div>

          <Link
            to="/materi"
            className="flex items-center gap-0.5 text-xs font-medium text-home-accent hover:underline"
          >
            Semua Materi
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Active Filter */}
        {isFiltering && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-home-border bg-card px-4 py-2.5">
            <span className="text-xs text-home-muted">
              `Jenjang: ${filterLevel}`
            </span>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-home-accent"
            >
              <RotateCcw size={13} />
              Reset Filter
            </button>
          </div>
        )}

        {/* Featured Cards */}
        {filteredFeatured.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredFeatured.map((item) => (
              <FeaturedCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-home-border bg-card px-6 py-10 text-center">
            <Search
              size={26}
              className="mx-auto text-home-muted"
            />

            <h3 className="mt-3 font-heading text-sm font-bold text-brand">
              Materi tidak ditemukan
            </h3>

            <p className="mt-2 text-xs text-home-muted">
              Coba kata kunci atau jenjang yang berbeda.
            </p>

            <Button
              type="button"
              onClick={handleReset}
              size="sm"
              className="mt-4 bg-brand"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
