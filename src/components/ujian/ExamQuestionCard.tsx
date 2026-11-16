
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react'

import { useState } from 'react'

import Badge from '../ui/Badge'
import Button from '../ui/Button'
import type {
  ExamFormula,
  ExamQuestion,
} from '../../services/simulasiUjianService'
import {
  getAssessmentContentText,
  getAssessmentImage,
} from '../../services/assessmentContent'

type Props = {
  question: ExamQuestion | null
  questionNumber: number
  totalQuestions: number
  answer: string | null
  flagged: boolean
  formulas: ExamFormula[]
  submitted: boolean
  onAnswer: (answer: string) => void
  onFlag: (flagged: boolean) => void
  onNavigate: (number: number) => void
}

export default function ExamQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  flagged,
  formulas,
  submitted,
  onAnswer,
  onFlag,
  onNavigate,
}: Props) {
  const [formulaOpen, setFormulaOpen] = useState(false)
  const promptText = question
    ? getAssessmentContentText(question.prompt)
    : ''
  const promptImage = question
    ? getAssessmentImage(question.prompt)
    : null

  return (
    <section className="flex flex-col gap-4 lg:col-span-8">
      <article className="rounded-xl border border-[#e2e8f0] bg-card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="primary"
              className="rounded-lg bg-brand px-2.5 py-1 text-sm"
            >
              Soal No. {questionNumber}
            </Badge>

            {question && (
              <Badge
                variant="muted"
                rounded="full"
                className="border border-[#e2e8f0] bg-[#f1f5f9] px-2.5 text-xs text-[#475569]"
              >
                {question.difficulty} • {question.points} Poin
              </Badge>
            )}
          </div>

          <span className="text-xs text-[#75777e]">
            {question?.type ?? 'Soal belum tersedia'}
          </span>
        </div>

        {question ? (
          <div className="space-y-4 pt-4">
            {promptText && (
              <p className="whitespace-pre-line text-base leading-[1.6] text-[#1e293b]">
                {promptText}
              </p>
            )}

            {promptImage && (
              <figure className="overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-2 sm:p-4">
                <img
                  src={promptImage.url}
                  alt={promptImage.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="mx-auto max-h-[28rem] w-full object-contain"
                />
              </figure>
            )}

            <fieldset className="space-y-2.5" disabled={submitted}>
              <legend className="mb-2 text-xs font-medium text-foreground-muted">
                Pilih salah satu jawaban yang paling tepat:
              </legend>

              {question.options.map((option) => {
                const active = answer === option.value

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border p-3.5 transition-colors ${
                      active
                        ? 'border-2 border-[#2563eb] bg-[#eaf2ff]'
                        : 'border-[#e2e8f0] bg-card hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    } ${submitted ? 'cursor-default' : ''}`}
                  >
                    <input
                      type="radio"
                      name={`answer-${question.number}`}
                      value={option.value}
                      checked={active}
                      onChange={() => onAnswer(option.value)}
                      className="sr-only"
                    />

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold ${
                        active
                          ? 'border-[#2563eb] bg-[#2563eb] text-white'
                          : 'border-[#e2e8f0] bg-[#f1f5f9] text-[#475569]'
                      }`}
                    >
                      {option.value}
                    </span>

                    <span
                      className={`flex-1 text-[15px] ${
                        active
                          ? 'font-semibold text-[#1e3a8a]'
                          : 'text-[#334155]'
                      }`}
                    >
                      {getAssessmentContentText(option.label)}
                    </span>

                    {active && (
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-[#2563eb]"
                      />
                    )}
                  </label>
                )
              })}
            </fieldset>
          </div>
        ) : (
          <div className="py-12 text-center">
            <BookOpen
              size={30}
              className="mx-auto text-brand-secondary"
            />
            <h2 className="mt-3 font-heading text-base font-semibold text-brand">
              Konten soal nomor {questionNumber} belum tersedia
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              Soal ini tidak tersedia pada data paket.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#f1f5f9] pt-4">
          <Button
            variant="outline"
            size="md"
            disabled={submitted || questionNumber <= 1}
            onClick={() => onNavigate(questionNumber - 1)}
            className="text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Soal Sebelumnya
          </Button>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#fef3c7] bg-[#fffbeb] px-3.5 py-2 text-[13px] font-medium text-amber-900 hover:bg-[#fef9c3]">
            <input
              type="checkbox"
              checked={flagged}
              disabled={submitted}
              onChange={(event) => onFlag(event.target.checked)}
              className="h-4 w-4 accent-amber-500"
            />
            <Bookmark size={18} className="text-amber-600" />
            Ragu-ragu (Tandai Kuning)
          </label>

          <Button
            variant="primary"
            size="md"
            disabled={submitted || questionNumber >= totalQuestions}
            onClick={() => onNavigate(questionNumber + 1)}
            className="bg-brand px-5 text-sm hover:bg-[#152e4d]"
          >
            Simpan & Lanjut
            <ArrowRight size={18} />
          </Button>
        </div>
      </article>

      {formulas.length > 0 && (
      <section className="rounded-xl border border-[#e2e8f0] bg-card p-4">
        <button
          type="button"
          aria-expanded={formulaOpen}
          onClick={() => setFormulaOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className="flex items-center gap-2 font-heading text-sm font-semibold text-brand-secondary">
            <BookOpen size={18} />
            Bantuan Rumus & Konstanta Fisika Penting
          </span>

          <ChevronDown
            size={18}
            className={`text-foreground-muted transition-transform ${
              formulaOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {formulaOpen && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {formulas.map((formula) => (
              <div
                key={formula.title}
                className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3"
              >
                <h3 className="font-heading text-xs font-bold uppercase text-brand">
                  {formula.title}
                </h3>
                <p className="mt-1 font-mono text-[13px] text-foreground">
                  {formula.formula}
                </p>
                <p className="mt-1 text-[11px] text-foreground-muted">
                  {formula.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
      )}
    </section>
  )
}
