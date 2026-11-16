
import { useEffect, useState } from 'react'
import {
  BookOpen,
  Check,
  CheckCircle2,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Badge from '../components/ui/Badge'
import ChapterCard from '../components/materi/detail/ChapterCard'
import VideoPreview from '../components/materi/detail/VideoPreview'
import MateriSidebar from '../components/materi/detail/MateriSidebar'

import {
  getDetailMateri,
  type DetailMateriData,
} from '../services/detailMateriService'

export default function DetailMateri() {
  const { slug } = useParams<{ slug: string }>()

  const [data, setData] = useState<DetailMateriData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [openChapters, setOpenChapters] = useState<number[]>([
    1, 2, 3,
  ])

  const [shareStatus, setShareStatus] = useState('')

  /* =====================================
     LOAD DETAIL
  ===================================== */

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(false)
      setData(null)
      setShareStatus('')
      setOpenChapters([1, 2, 3])

      try {
        const result = await getDetailMateri(slug ?? '')

        if (active) {
          setData(result)
        }
      } catch {
        if (active) {
          setError(true)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [slug])

  /* =====================================
     HANDLERS
  ===================================== */

  function toggleChapter(id: number) {
    setOpenChapters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('Link berhasil disalin')
    } catch {
      setShareStatus('Tidak dapat menyalin link')
    }
  }

  /* =====================================
     PAGE STATES
  ===================================== */

  if (loading) {
    return (
      <div
        role="status"
        className="mx-auto max-w-7xl px-6 py-12 text-sm text-foreground-muted"
      >
        Memuat detail materi...
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl px-6 py-12 text-sm text-red-600"
      >
        Gagal memuat detail materi.
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="font-heading text-xl font-bold text-brand">
          Materi tidak ditemukan
        </h1>

        <Link
          to="/materi"
          className="mt-4 inline-flex text-sm font-semibold text-brand-secondary"
        >
          Kembali ke Jelajahi Materi
        </Link>
      </div>
    )
  }

  /* =====================================
     SYLLABUS SUMMARY
  ===================================== */

  const totalLessons = data.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
  )

  const totalMinutes = data.chapters.reduce(
    (total, chapter) =>
      total +
      chapter.lessons.reduce(
        (sum, lesson) => sum + lesson.durationMinutes,
        0
      ),
    0
  )

  const durationLabel = `${Math.floor(totalMinutes / 60)} Jam ${
    totalMinutes % 60
  } Menit`

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div className="w-full">

      {/* ACADEMIC CONTEXT */}
      <div className="w-full bg-muted py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-semibold"
          >
            <Link
              to="/materi"
              className="inline-flex items-center gap-1.5 text-brand-secondary hover:text-brand"
            >
              <BookOpen size={16} />
              Jelajahi Materi
            </Link>

            <span className="text-[#c4c6ce]">/</span>

            <Link
              to="/materi"
              className="text-brand-secondary hover:text-brand"
            >
              {data.subject}
            </Link>

            <span className="text-[#c4c6ce]">/</span>

            <span
              aria-current="page"
              className="font-semibold text-brand"
            >
              {data.shortTitle}
            </span>
          </nav>

          {(data.curriculum || data.category) && (
            <span className="inline-flex items-center gap-2 rounded bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-secondary" />
              {data.curriculum || data.category}
            </span>
          )}
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">

          {/* LEFT CONTENT */}
          <div className="flex flex-col space-y-8 lg:col-span-8">

            {/* MATERIAL HEADING */}
            <section className="flex flex-col space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="secondary"
                  size="md"
                  className="bg-soft-blue text-[#001c3a]"
                >
                  {data.level}
                </Badge>

                {data.curriculum && (
                  <Badge
                    variant="muted"
                    size="md"
                    className="bg-stroke text-foreground-muted"
                  >
                    {data.curriculum}
                  </Badge>
                )}

                <Badge
                  variant="muted"
                  size="md"
                  className="bg-[#eceef0] text-brand-secondary"
                >
                  {data.category}
                </Badge>
              </div>

              <h1 className="font-heading text-[32px] font-bold leading-[40px] tracking-tight text-brand md:text-[40px] md:leading-[48px]">
                {data.title}
              </h1>

              {data.description && (
                <p className="text-base leading-[26px] text-foreground-muted">
                  {data.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-[13px] text-foreground-muted">
                <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                  <BookOpen
                    size={18}
                    className="text-brand-secondary"
                  />
                  Modul Belajar Mandiri
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2
                    size={17}
                    className="text-brand-secondary"
                  />
                  Materi Pembelajaran Aktif
                </span>

              </div>
            </section>

            {/* VIDEO PREVIEW */}
            <VideoPreview
              imageUrl={data.imageUrl}
              shortTitle={data.shortTitle}
              preview={data.preview}
            />

            {/* LEARNING OUTCOMES */}
            <section className="rounded-xl bg-card p-6 shadow-sm lg:p-7">
              <div className="mb-5 flex items-center gap-2.5">
                <CheckCircle2
                  size={24}
                  className="text-brand-secondary"
                />

                <h2 className="font-heading text-[22px] font-semibold leading-7 text-brand">
                  Capaian & Kompetensi Pembelajaran
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {data.outcomes.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 rounded-lg bg-muted p-4"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#aeceff] text-[#375782]">
                      <Check size={17} strokeWidth={3} />
                    </span>

                    <div>
                      <h3 className="mb-1 font-heading text-sm font-semibold text-brand">
                        {item.title}
                      </h3>

                      <p className="text-[13px] leading-5 text-foreground-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SYLLABUS */}
            <section className="flex flex-col space-y-4">
              <div className="flex flex-col justify-between gap-2 pb-2 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-heading text-[22px] font-semibold text-brand">
                    Silabus & Daftar Materi
                  </h2>

                  <p className="mt-1 text-[13px] text-foreground-muted">
                    Alur belajar disusun adaptif dari fondasi konsep
                    hingga latihan kalkulasi mendalam.
                  </p>
                </div>

                <Badge
                  variant="muted"
                  size="md"
                  className="self-start whitespace-nowrap rounded-lg bg-stroke text-brand-secondary"
                >
                  {data.chapters.length} Bab • {totalLessons} Pembelajaran
                  {' • '}
                  Total {durationLabel}
                </Badge>
              </div>

              <div className="space-y-3.5">
                {data.chapters.map((chapter) => (
                  <ChapterCard
                    key={chapter.id}
                    chapter={chapter}
                    open={openChapters.includes(chapter.id)}
                    onToggle={() => toggleChapter(chapter.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <MateriSidebar
            data={data}
            onShare={() => void handleShare()}
            shareStatus={shareStatus}
          />
        </div>
      </section>
    </div>
  )
}
