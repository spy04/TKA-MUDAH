
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'

import LessonPlayer from '../components/belajar/LessonPlayer'
import LessonWorkspace from '../components/belajar/LessonWorkspace'
import LessonSyllabus from '../components/belajar/LessonSyllabus'

import {
  getRuangBelajar,
  saveLessonProgress,
  type RuangBelajarData,
} from '../services/ruangBelajarService'

export default function RuangBelajar() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const requestedLessonId = searchParams.get('lessonId') ?? undefined

  const [data, setData] = useState<RuangBelajarData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [feedbackError, setFeedbackError] = useState('')

  const [completed, setCompleted] = useState(false)
  const [savingProgress, setSavingProgress] = useState(false)
  const [noteTimestamp, setNoteTimestamp] = useState<number | null>(
    null
  )
  const lastSavedPosition = useRef(0)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setLoadError('')
      setFeedbackError('')
      setData(null)
      setCompleted(false)
      setNoteTimestamp(null)

      try {
        const result = await getRuangBelajar(slug ?? '', requestedLessonId)
        if (active) {
          setData(result)
          setCompleted(result?.currentCompleted ?? false)
          lastSavedPosition.current = result?.initialPosition ?? 0
        }
      } catch (caught) {
        if (active) {
          setLoadError(
            caught instanceof Error
              ? caught.message
              : 'Gagal memuat ruang belajar.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [slug, requestedLessonId])

  const handleNoteHandled = useCallback(() => {
    setNoteTimestamp(null)
  }, [])

  const handlePositionChange = useCallback(
    (position: number, force = false) => {
      if (!data || savingProgress) return
      if (!force && Math.abs(position - lastSavedPosition.current) < 10) return
      lastSavedPosition.current = position
      setSavingProgress(true)
      void saveLessonProgress(data.lessonId, position, false)
        .then((progress) => {
          setCompleted(progress.completed)
        })
        .catch((caught: unknown) => {
          setFeedbackError(
            caught instanceof Error
              ? caught.message
              : 'Gagal menyimpan progres belajar.'
          )
        })
        .finally(() => setSavingProgress(false))
    },
    [data, savingProgress]
  )

  const handleMarkComplete = useCallback(async () => {
    if (!data) return
    setSavingProgress(true)
    setFeedbackError('')
    try {
      await saveLessonProgress(data.lessonId, data.duration, true)
      setCompleted(true)
      const refreshed = await getRuangBelajar(data.slug, data.lessonId)
      if (refreshed) setData(refreshed)
    } catch (caught) {
      setFeedbackError(
        caught instanceof Error
          ? caught.message
          : 'Gagal menyimpan progres belajar.'
      )
    } finally {
      setSavingProgress(false)
    }
  }, [data])

  if (loading) {
    return (
      <div
        role="status"
        className="mx-auto max-w-7xl px-6 py-12 text-sm text-foreground-muted"
      >
        Memuat ruang belajar...
      </div>
    )
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="mx-auto max-w-7xl px-6 py-12 text-sm text-red-600"
      >
        {loadError}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h1 className="font-heading text-xl font-bold text-brand">
          Ruang belajar tidak ditemukan
        </h1>

        <Link
          to="/materi"
          className="mt-4 inline-block text-sm font-semibold text-brand-secondary"
        >
          Kembali ke Jelajahi Materi
        </Link>
      </div>
    )
  }

  const allLessons = data.chapters.flatMap((chapter) => chapter.lessons)
  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.lessonId === data.lessonId
  )
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null
  const lessonPath = (lessonId: string) =>
    `/belajar/${encodeURIComponent(data.slug)}?lessonId=${encodeURIComponent(lessonId)}`

  return (
    <div className="w-full">
      {/* WORKSPACE CONTROL STRIP */}
      <section className="w-full bg-card shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-stroke px-4 py-3.5 sm:px-6 lg:px-8">
          <nav
            aria-label="Navigasi pelajaran"
            className="flex min-w-0 flex-wrap items-center gap-3"
          >
            <Link
              to={`/materi/${data.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm text-brand-secondary transition-colors hover:text-brand"
            >
              <ArrowLeft size={18} />
              Silabus {data.subject}
            </Link>

            <span className="text-stroke">/</span>

            <span className="text-[13px] text-foreground-muted">
              {data.chapter}
            </span>

            <span className="text-stroke">/</span>

            <h1 className="font-heading text-sm font-semibold text-brand">
              {data.lessonTitle}
            </h1>
          </nav>

          <div className="flex shrink-0 items-center gap-5">
            <div className="hidden items-center gap-3 sm:flex">
              <ProgressBar
                value={data.progress}
                variant="secondary"
                className="w-24"
              />

              <span className="font-heading text-[11px] font-medium text-foreground-muted">
                {data.progress}% selesai
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              disabled={completed || savingProgress}
              onClick={() => void handleMarkComplete()}
              className="bg-brand text-sm hover:bg-brand-secondary"
            >
              <CheckCircle2 size={16} />
              {savingProgress
                ? 'Menyimpan...'
                : completed
                  ? 'Sudah Selesai'
                  : 'Tandai Selesai'}
            </Button>
          </div>
        </div>
        {feedbackError && (
          <p role="alert" className="mx-auto max-w-7xl px-4 pb-3 text-sm text-red-600 sm:px-6 lg:px-8">
            {feedbackError}
          </p>
        )}
      </section>

      {/* MAIN WORKSPACE */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <main className="flex min-w-0 flex-col gap-6 lg:col-span-8">
            <LessonPlayer
              key={`${data.slug}:${data.lessonId}`}
              data={data}
              onTakeNote={setNoteTimestamp}
              onPositionChange={handlePositionChange}
            />

            {/* PREVIOUS / NEXT LESSON */}
            <nav
              aria-label="Pelajaran sebelumnya dan berikutnya"
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-sm"
            >
              {previousLesson ? (
                <Link
                  to={lessonPath(previousLesson.lessonId)}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-brand"
                >
                  <ArrowLeft size={18} />
                  {previousLesson.id} {previousLesson.title}
                </Link>
              ) : (
                <span className="text-sm text-foreground-muted">
                  Pelajaran pertama
                </span>
              )}

              <span className="hidden h-3 w-px bg-stroke sm:block" />

              {nextLesson ? (
                <Link
                  to={lessonPath(nextLesson.lessonId)}
                  className="inline-flex items-center gap-1.5 text-sm text-brand-secondary"
                >
                  {nextLesson.id} {nextLesson.title}
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <span className="text-sm text-foreground-muted">
                  Pelajaran terakhir
                </span>
              )}
            </nav>

            {/* LESSON TABS */}
            <LessonWorkspace
              key={`${data.slug}:${data.lessonId}`}
              data={data}
              noteTimestamp={noteTimestamp}
              onNoteHandled={handleNoteHandled}
            />
          </main>

          {/* SYLLABUS SIDEBAR */}
          <LessonSyllabus
            data={data}
            completed={completed}
          />
        </div>
      </div>
    </div>
  )
}
