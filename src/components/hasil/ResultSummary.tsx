
import {
  Award,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Timer,
  XCircle,
} from 'lucide-react'

import Badge from '../ui/Badge'
import Button from '../ui/Button'

import type { HasilLatihanData } from '../../services/hasilLatihanService'

type ResultSummaryProps = {
  data: HasilLatihanData
}

export default function ResultSummary({
  data,
}: ResultSummaryProps) {
  const accuracy = data.answered > 0
    ? Math.round((data.correct / data.answered) * 100)
    : 0

  const participation = data.totalQuestions > 0
    ? Math.round((data.answered / data.totalQuestions) * 100)
    : 0

  const minutes = Math.floor(data.durationSeconds / 60)
  const seconds = data.durationSeconds % 60

  const averageSeconds = data.answered > 0
    ? Math.round(data.durationSeconds / data.answered)
    : 0

  const averageMinutes = Math.floor(averageSeconds / 60)
  const averageRemaining = averageSeconds % 60

  return (
    <section className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-card p-6 shadow-sm lg:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#aeceff]/20 blur-3xl" />

      <div className="relative flex flex-col justify-between gap-4 border-b border-stroke pb-5 md:flex-row md:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              rounded="full"
              className="bg-[#aeceff]/60 uppercase tracking-wider text-brand"
            >
              CBT Mandiri • Selesai
            </Badge>

            <span className="text-[#75777e]">•</span>

            <span className="text-[11px] text-foreground-muted">
              ID Sesi: #{data.sessionId}
            </span>
          </div>

          <h1 className="font-heading text-[28px] font-bold tracking-tight text-brand">
            {data.title}
          </h1>

          <p className="text-sm text-foreground-muted">
            {data.subtitle}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => window.print()}
          className="gap-2 bg-muted text-foreground hover:bg-stroke print:hidden"
        >
          <Download size={18} />
          Unduh Hasil (PDF)
        </Button>
      </div>

      <div className="relative grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-5">
        {/* SCORE */}
        <article className="col-span-2 flex flex-col justify-between gap-3 rounded-xl bg-muted/70 p-4 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              Nilai Akhir
            </span>

            <Award size={20} className="text-brand-secondary" />
          </div>

          <div className="flex items-baseline gap-2">
            <strong className="font-heading text-[40px] font-extrabold leading-none text-brand">
              {data.score}
            </strong>
            <span className="text-[13px] text-[#75777e]">
              / 100
            </span>
          </div>

          <Badge
            variant="secondary"
            className="self-start gap-1.5 rounded-md bg-[#aeceff] px-2.5 py-1 text-brand"
          >
            <CheckCircle2 size={14} />
            {data.passed === null
              ? 'Ambang kelulusan belum ditentukan'
              : data.passed
                ? 'Lulus'
                : 'Belum lulus'}
          </Badge>
        </article>

        {/* ANSWERED */}
        <article className="flex flex-col justify-between gap-3 rounded-xl bg-muted/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              Soal Terjawab
            </span>

            <ClipboardCheck
              size={20}
              className="shrink-0 text-brand-secondary"
            />
          </div>

          <div className="flex items-baseline gap-1.5">
            <strong className="font-heading text-[28px] font-bold leading-none text-foreground">
              {data.answered}
            </strong>

            <span className="text-[13px] text-[#75777e]">
              / {data.totalQuestions} Soal
            </span>
          </div>

          <p className="text-[13px] text-foreground-muted">
            Tingkat Partisipasi: {participation}%
          </p>
        </article>

        {/* CORRECT */}
        <article className="flex flex-col justify-between gap-3 rounded-xl bg-muted/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              Jawaban Benar
            </span>

            <CheckCircle2 size={20} className="text-[#15803d]" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <strong className="font-heading text-[28px] font-bold leading-none text-[#15803d]">
              {data.correct}
            </strong>

            <span className="text-[13px] text-[#75777e]">
              Soal
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#15803d]">
            <Check size={13} />
            {accuracy}% Akurasi Konseptual
          </span>
        </article>

        {/* WRONG */}
        <article className="flex flex-col justify-between gap-3 rounded-xl bg-muted/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              Jawaban Salah
            </span>

            <XCircle size={20} className="text-[#b91c1c]" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <strong className="font-heading text-[28px] font-bold leading-none text-[#b91c1c]">
              {data.wrong}
            </strong>

            <span className="text-[13px] text-[#75777e]">
              Soal
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#b91c1c]">
            <XCircle size={13} />
            Perlu Tinjauan Mandiri
          </span>
        </article>

        {/* DURATION */}
        <article className="flex flex-col justify-between gap-3 rounded-xl bg-muted/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              Durasi Waktu
            </span>

            <Timer size={20} className="text-brand-secondary" />
          </div>

          <div className="flex flex-col">
            <strong className="font-heading text-base font-bold text-foreground">
              {minutes}m {seconds}s
            </strong>

            <span className="text-[13px] text-[#75777e]">
              {data.allocatedMinutes === null
                ? 'Alokasi tidak tersedia'
                : `Alokasi: ${data.allocatedMinutes} Menit`}
            </span>
          </div>

          <p className="text-[13px] text-foreground-muted">
            Rerata: ~{averageMinutes}m {averageRemaining}s / Soal
          </p>
        </article>
      </div>

      {data.passed === null && (
        <p className="relative rounded-xl bg-muted p-4 text-sm leading-[22px] text-foreground-muted">
          Status kelulusan tidak ditampilkan karena ambang kelulusan belum ditentukan.
        </p>
      )}
    </section>
  )
}
