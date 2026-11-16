
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  RotateCcw,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import SegmentedControl from '../components/ui/SegmentedControl'

import ResultSummary from '../components/hasil/ResultSummary'
import ReviewQuestionCard from '../components/hasil/ReviewQuestionCard'

import {
  getHasilLatihan,
  type HasilLatihanData,
} from '../services/hasilLatihanService'

type ReviewFilter =
  | 'all'
  | 'correct'
  | 'wrong'
  | 'unanswered'

type ReviewSort =
  | 'number'
  | 'wrong-first'
  | 'difficulty'

const sortOptions: {
  value: ReviewSort
  label: string
}[] = [
  { value: 'number', label: 'Urutan nomor' },
  { value: 'wrong-first', label: 'Prioritas Salah Dahulu' },
  { value: 'difficulty', label: 'Tingkat kesulitan' },
]

export default function HasilLatihan() {
  const { attemptId } = useParams<{ attemptId: string }>()

  const [data, setData] = useState<HasilLatihanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [filter, setFilter] = useState<ReviewFilter>('all')
  const [sort, setSort] = useState<ReviewSort>('number')

  useEffect(() => {
    let active = true

    async function loadResult() {
      setLoading(true)
      setError('')
      setData(null)

      try {
        const result = await getHasilLatihan(attemptId ?? '')

        if (active) {
          setData(result)
          setFilter('all')
          setSort('number')
        }
      } catch (caught) {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Gagal memuat hasil latihan.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadResult()

    return () => {
      active = false
    }
  }, [attemptId])

  const filteredReviews = useMemo(() => {
    if (!data) return []

    const result = data.reviews.filter(
      (item) => filter === 'all' || item.status === filter
    )

    if (sort === 'wrong-first') {
      return [...result].sort((a, b) => {
        const priority = {
          wrong: 0,
          unanswered: 1,
          correct: 2,
        }

        return (
          priority[a.status] - priority[b.status] ||
          a.number - b.number
        )
      })
    }

    if (sort === 'difficulty') {
      return [...result].sort((a, b) => {
        return a.difficulty.localeCompare(b.difficulty) || a.number - b.number
      })
    }

    return [...result].sort((a, b) => a.number - b.number)
  }, [data, filter, sort])

  if (loading) {
    return (
      <div
        role="status"
        className="mx-auto max-w-7xl px-4 py-12 text-sm text-foreground-muted"
      >
        Memuat hasil latihan...
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl px-4 py-12 text-sm text-red-600"
      >
        {error || 'Data hasil latihan tidak ditemukan.'}
      </div>
    )
  }

  const correctSamples = data.reviews.filter(
    (item) => item.status === 'correct'
  ).length

  const wrongSamples = data.reviews.filter(
    (item) => item.status === 'wrong'
  ).length

  const unansweredSamples = data.reviews.filter(
    (item) => item.status === 'unanswered'
  ).length

  const filterOptions: {
    value: ReviewFilter
    label: string
    disabled?: boolean
  }[] = [
    {
      value: 'all',
      label: `Semua Sampel (${data.reviews.length})`,
    },
    {
      value: 'correct',
      label: `Benar (${correctSamples})`,
    },
    {
      value: 'wrong',
      label: `Salah (${wrongSamples})`,
    },
    {
      value: 'unanswered',
      label: `Belum Dijawab (${unansweredSamples})`,
      disabled: unansweredSamples === 0,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">

      {/* BREADCRUMB */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 font-heading text-xs font-semibold text-foreground-muted"
      >
        <Link
          to="/latihan"
          className="flex items-center gap-1 transition-colors hover:text-brand"
        >
          <FolderOpen size={16} />
          Latihan Soal
        </Link>

        <ChevronRight
          size={14}
          className="text-[#75777e]"
        />

        <Link
          to="/latihan"
          className="transition-colors hover:text-brand"
        >
          {data.subtitle}
        </Link>

        <ChevronRight
          size={14}
          className="text-[#75777e]"
        />

        <span aria-current="page" className="font-bold text-brand">
          Hasil & Pembahasan
        </span>
      </nav>

      {/* RESULT SUMMARY */}
      <ResultSummary data={data} />

      {/* QUESTION REVIEW */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-[22px] font-bold text-brand">
              Pembahasan Soal
            </h2>

            <p className="mt-1 text-[13px] leading-5 text-foreground-muted">
              Tinjau jawaban dan pembahasan dari attempt ini.
              Menampilkan{' '}
              {data.reviews.length} soal dari total{' '}
              {data.totalQuestions} soal latihan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <SegmentedControl
              options={filterOptions}
              value={filter}
              onChange={setFilter}
              ariaLabel="Filter hasil pembahasan"
              size="md"
              className="rounded-xl bg-stroke"
            />

            <div className="relative">
              <select
                aria-label="Urutkan Pembahasan Soal"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as ReviewSort)
                }
                className="appearance-none rounded-xl bg-card py-2 pl-3.5 pr-8 font-heading text-xs font-semibold text-foreground shadow-sm outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#75777e]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((item) => (
              <ReviewQuestionCard
                key={item.number}
                item={item}
              />
            ))
          ) : (
            <div className="rounded-xl bg-card px-6 py-10 text-center text-sm text-foreground-muted">
              Tidak ada sampel soal untuk filter ini.
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM ACTIONS */}
      <div className="sticky bottom-4 z-20 flex w-full flex-col items-center justify-between gap-4 rounded-2xl bg-card/95 p-4 shadow-xl backdrop-blur-md sm:flex-row sm:p-5 print:hidden">
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 font-heading text-xs font-semibold text-brand-secondary transition-colors hover:text-brand"
        >
          <BarChart3 size={18} />
          Lihat Dashboard Progres Belajar
        </Link>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Button
            to="/latihan"
            variant="secondary"
            className="flex-1 bg-muted px-5 py-2.5 text-brand hover:bg-stroke sm:flex-initial"
          >
            Kembali ke Latihan Soal
          </Button>

          <Button
            to={`/ujian/simulasi/${data.packageId}`}
            variant="primary"
            className="flex-1 bg-brand px-6 py-2.5 text-white hover:bg-brand-dark sm:flex-initial"
          >
            <RotateCcw size={18} />
            Coba Lagi Latihan
          </Button>
        </div>
      </div>
    </div>
  )
}
