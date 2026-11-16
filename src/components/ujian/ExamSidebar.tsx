
import {
  Bookmark,
  Grid2X2,
} from 'lucide-react'

import Badge from '../ui/Badge'

type Props = {
  totalQuestions: number
  currentQuestion: number
  answeredNumbers: number[]
  flaggedNumbers: number[]
  submitted: boolean
  saving?: boolean
  onNavigate: (number: number) => void
}

export default function ExamSidebar({
  totalQuestions,
  currentQuestion,
  answeredNumbers,
  flaggedNumbers,
  submitted,
  saving = false,
  onNavigate,
}: Props) {
  const answered = new Set(answeredNumbers)
  const flagged = new Set(flaggedNumbers)

  const answeredCount = answered.size
  const flaggedCount = flagged.size
  const unansweredCount = totalQuestions - new Set([
  ...answeredNumbers,
  ...flaggedNumbers,
]).size

  return (
    <aside className="flex flex-col gap-4 lg:col-span-4">
      <section className="rounded-xl border border-[#e2e8f0] bg-card p-4">
        <div className="flex items-center justify-between pb-2">
          <h2 className="font-heading text-sm font-bold text-foreground">
            Status Pengerjaan
          </h2>
          <Badge variant="muted">
            {totalQuestions} Soal
          </Badge>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-[#e2e8f0] bg-[#f1f5f9] p-2">
            <span className="block text-[11px] text-[#64748b]">
              Terjawab
            </span>
            <strong className="font-heading text-base text-brand">
              {answeredCount}
            </strong>
          </div>

          <div className="rounded-lg border border-[#fef3c7] bg-[#fffbeb] p-2">
            <span className="block text-[11px] text-amber-700">
              Ragu-ragu
            </span>
            <strong className="font-heading text-base text-amber-800">
              {flaggedCount}
            </strong>
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2">
            <span className="block text-[11px] text-[#94a3b8]">
              Belum
            </span>
            <strong className="font-heading text-base text-[#64748b]">
              {unansweredCount}
            </strong>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#e2e8f0] bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-1.5 font-heading text-sm font-bold text-foreground">
            <Grid2X2 size={18} className="text-brand-secondary" />
            Daftar Nomor Soal
          </h2>
          <span className="text-[11px] text-foreground-muted">
            Klik untuk loncat
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {Array.from(
            { length: totalQuestions },
            (_, index) => index + 1
          ).map((number) => {
            const active = number === currentQuestion
            const isFlagged = flagged.has(number)
            const isAnswered = answered.has(number)

            const colorClass = active
              ? 'bg-[#2563eb] text-white ring-2 ring-[#2563eb] ring-offset-2'
              : isFlagged
                ? 'border border-amber-300 bg-[#fef3c7] text-amber-900 hover:bg-[#fde68a]'
                : isAnswered
                  ? 'bg-brand text-white hover:opacity-90'
                  : 'border border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'

            return (
              <button
                key={number}
                type="button"
                disabled={submitted}
                aria-label={`Buka soal ${number}`}
                aria-current={active ? 'step' : undefined}
                onClick={() => onNavigate(number)}
                className={`relative flex h-9 items-center justify-center rounded-lg font-heading text-[13px] font-semibold disabled:cursor-default ${colorClass}`}
              >
                {number}

                {isFlagged && !active && (
                  <Bookmark
                    size={10}
                    fill="currentColor"
                    className="absolute right-0.5 top-0.5 text-amber-700"
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-4 space-y-1.5 border-t border-[#f1f5f9] pt-3 text-[11px] text-foreground-muted">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-brand" />
            Sudah Dijawab ({answeredCount} Soal)
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-amber-300 bg-[#fef3c7]" />
            Ragu-ragu ({flaggedCount} Soal)
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-[#e2e8f0] bg-[#f8fafc]" />
            Belum Dijawab ({unansweredCount} Soal)
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between gap-2 rounded-xl border border-[#e2e8f0] bg-card p-3">
        <span className="flex items-center gap-2 text-xs text-[#475569]">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {submitted
            ? 'Sesi ujian diakhiri'
            : saving
              ? 'Menyimpan jawaban...'
              : 'Jawaban tersimpan'}
        </span>
        <span className="font-mono text-[11px] text-[#75777e]">
          Server
        </span>
      </div>
    </aside>
  )
}
