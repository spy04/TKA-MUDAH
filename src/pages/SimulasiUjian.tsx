import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ClipboardCheck,
  Clock3,
  Flag,
} from 'lucide-react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import ExamQuestionCard from '../components/ujian/ExamQuestionCard'
import ExamSidebar from '../components/ujian/ExamSidebar'
import ExamSubmitModal from '../components/ujian/ExamSubmitModal'
import {
  getAttemptById,
  getSimulasiUjian,
  submitAttempt,
  updateAttemptAnswer,
  type ExamData,
} from '../services/simulasiUjianService'

function formatTimer(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remaining = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export default function SimulasiUjian() {
  const { packageId } = useParams<{ packageId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const requestedAttemptId = searchParams.get('attemptId')

  const [data, setData] = useState<ExamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingAnswer, setSavingAnswer] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flaggedNumbers, setFlaggedNumbers] = useState<number[]>([])
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [deadline, setDeadline] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const pendingSaves = useRef(new Map<string, Promise<void>>())
  const savingCount = useRef(0)
  const submittingRef = useRef(false)
  const expirationHandled = useRef(false)

  useEffect(() => {
    let active = true
    async function loadExam() {
      setLoading(true)
      setError('')
      setData(null)
      setDeadline(null)
      expirationHandled.current = false
      pendingSaves.current.clear()
      savingCount.current = 0
      try {
        const result = requestedAttemptId
          ? await getAttemptById(requestedAttemptId)
          : await getSimulasiUjian(packageId ?? '')
        if (!active) return
        if (result.status !== 'IN_PROGRESS') {
          navigate(`/latihan/hasil/${result.attemptId}`, { replace: true })
          return
        }
        setData(result)
        setCurrentQuestion(result.currentQuestion)
        setAnswers(result.initialAnswers)
        setFlaggedNumbers(result.initialFlagged)
        setRemainingSeconds(result.initialSeconds)
        setDeadline(Date.now() + result.initialSeconds * 1000)
        setModalOpen(false)
        if (!requestedAttemptId) {
          setSearchParams({ attemptId: result.attemptId }, { replace: true })
        }
      } catch (caught) {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Gagal memuat paket ujian.'
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadExam()
    return () => {
      active = false
    }
  }, [packageId, requestedAttemptId, navigate, setSearchParams])

  const finalizeAttempt = useCallback(async () => {
    if (!data || submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    setError('')
    try {
      await Promise.all(Array.from(pendingSaves.current.values()))
      await submitAttempt(data.attemptId)
      navigate(`/latihan/hasil/${data.attemptId}`, { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Gagal mengumpulkan ujian. Periksa koneksi lalu coba kembali.'
      )
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }, [data, navigate])

  useEffect(() => {
    if (deadline === null || submitting) return
    function updateTimer() {
      if (deadline === null) return
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemainingSeconds(next)
      if (next === 0 && !expirationHandled.current) {
        expirationHandled.current = true
        setModalOpen(false)
        void finalizeAttempt()
      }
    }
    updateTimer()
    const interval = window.setInterval(updateTimer, 1000)
    return () => window.clearInterval(interval)
  }, [deadline, submitting, finalizeAttempt])

  function navigateQuestion(number: number) {
    if (!data || submitting || number < 1 || number > data.totalQuestions) return
    setCurrentQuestion(number)
  }

  function queueAnswer(
    questionNumber: number,
    selectedOptionKey: string | null,
    flagged: boolean
  ) {
    if (!data) return
    const question = data.questions.find((item) => item.number === questionNumber)
    if (!question) return
    const previous = pendingSaves.current.get(question.id) ?? Promise.resolve()
    const next = previous
      .catch(() => undefined)
      .then(() =>
        updateAttemptAnswer(
          data.attemptId,
          question.id,
          selectedOptionKey,
          flagged
        )
      )
    pendingSaves.current.set(question.id, next)
    savingCount.current += 1
    setSavingAnswer(true)
    void next.then(
      () => {
        savingCount.current = Math.max(0, savingCount.current - 1)
        setSavingAnswer(savingCount.current > 0)
      },
      (caught: unknown) => {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Gagal menyimpan jawaban.'
        )
        savingCount.current = Math.max(0, savingCount.current - 1)
        setSavingAnswer(savingCount.current > 0)
      }
    )
  }

  function updateAnswer(answer: string) {
    if (submitting) return
    setError('')
    setAnswers((current) => ({ ...current, [currentQuestion]: answer }))
    queueAnswer(
      currentQuestion,
      answer || null,
      flaggedNumbers.includes(currentQuestion)
    )
  }

  function updateFlag(flagged: boolean) {
    if (submitting) return
    setFlaggedNumbers((current) =>
      flagged
        ? Array.from(new Set([...current, currentQuestion]))
        : current.filter((number) => number !== currentQuestion)
    )
    queueAnswer(
      currentQuestion,
      answers[currentQuestion] || null,
      flagged
    )
  }

  if (loading) {
    return (
      <div role="status" className="mx-auto max-w-7xl px-4 py-12 text-sm text-foreground-muted">
        Memuat simulasi ujian...
      </div>
    )
  }
  if (error && !data) {
    return (
      <div role="alert" className="mx-auto max-w-7xl px-4 py-12 text-sm text-red-600">
        {error}
      </div>
    )
  }
  if (!data) return null

  const answeredNumbers = Object.entries(answers)
    .filter(([, answer]) => Boolean(answer))
    .map(([number]) => Number(number))
  const answeredCount = answeredNumbers.length
  const flaggedCount = flaggedNumbers.length
  const unansweredCount = Math.max(0, data.totalQuestions - answeredCount)
  const currentQuestionData =
    data.questions.find((item) => item.number === currentQuestion) ?? null
  const questionProgress =
    data.totalQuestions > 0
      ? (currentQuestion / data.totalQuestions) * 100
      : 0

  return (
    <div className="w-full">
      <div className="sticky top-16 z-40 border-b border-[#e2e8f0] bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2e8f0] bg-muted text-brand">
              <ClipboardCheck size={20} />
            </span>
            <div className="min-w-0">
              <span className="font-heading text-[11px] font-bold uppercase tracking-wide text-brand-secondary">
                {data.level} • {data.subject}
              </span>
              <h1 className="max-w-xl truncate font-heading text-[15px] font-bold text-foreground">
                {data.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-[#f1f5f9] px-3.5 py-1.5 text-foreground-muted">
            <Clock3 size={18} className="text-brand-secondary" />
            <span className="text-xs">Sisa Waktu:</span>
            <strong role="timer" aria-label="Sisa waktu ujian" className="font-mono text-sm text-brand">
              {formatTimer(remainingSeconds)}
            </strong>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-xs text-foreground-muted">
                Soal <strong className="text-foreground">{currentQuestion}</strong> dari {data.totalQuestions}
                <span className="text-[11px] text-[#75777e]"> ({Math.round(questionProgress)}%)</span>
              </span>
              <ProgressBar value={questionProgress} variant="primary" className="mt-1 w-24" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={submitting}
              onClick={() => setModalOpen(true)}
              className="gap-1.5 border-[#cbd5e1] text-[13px]"
            >
              <Flag size={17} className="text-brand-secondary" />
              Selesai Ujian
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div role="alert" className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            {remainingSeconds === 0 && (
              <Button size="sm" disabled={submitting} onClick={() => void finalizeAttempt()}>
                {submitting ? 'Menyimpan...' : 'Coba kumpulkan lagi'}
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <ExamQuestionCard
            question={currentQuestionData}
            questionNumber={currentQuestion}
            totalQuestions={data.totalQuestions}
            answer={answers[currentQuestion] ?? null}
            flagged={flaggedNumbers.includes(currentQuestion)}
            formulas={data.formulas}
            submitted={submitting}
            onAnswer={updateAnswer}
            onFlag={updateFlag}
            onNavigate={navigateQuestion}
          />
          <ExamSidebar
            totalQuestions={data.totalQuestions}
            currentQuestion={currentQuestion}
            answeredNumbers={answeredNumbers}
            flaggedNumbers={flaggedNumbers}
            submitted={submitting}
            saving={savingAnswer}
            onNavigate={navigateQuestion}
          />
        </div>
      </div>

      <ExamSubmitModal
        open={modalOpen}
        answeredCount={answeredCount}
        flaggedCount={flaggedCount}
        unansweredCount={unansweredCount}
        totalQuestions={data.totalQuestions}
        submitting={submitting}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          setModalOpen(false)
          void finalizeAttempt()
        }}
      />
    </div>
  )
}

