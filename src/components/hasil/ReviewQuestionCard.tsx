
import {
  BookOpen,
  Check,
  CheckCircle2,
  KeyRound,
  X,
  XCircle,
  ChartNoAxesColumn,
} from 'lucide-react'

import Badge from '../ui/Badge'

import type {
  ExplanationBlock,
  ReviewQuestion,
} from '../../services/hasilLatihanService'

type ReviewQuestionCardProps = {
  item: ReviewQuestion
}

function ExplanationContent({
  block,
}: {
  block: ExplanationBlock
}) {
  if (block.type === 'data' || block.type === 'formula') {
    return (
      <div
        className={`whitespace-pre-line rounded-lg bg-card p-3 text-[13px] leading-relaxed ${
          block.type === 'formula'
            ? 'font-mono text-brand'
            : 'text-foreground'
        }`}
      >
        {block.content}
      </div>
    )
  }

  if (block.type === 'reflection') {
    return (
      <div className="whitespace-pre-line rounded-lg bg-[#b91c1c]/10 p-3 text-[13px] leading-relaxed text-foreground">
        {block.content}
      </div>
    )
  }

  if (block.type === 'conclusion') {
    return (
      <div className="whitespace-pre-line border-t border-stroke pt-3 text-[13px] leading-relaxed text-foreground-muted">
        {block.content}
      </div>
    )
  }

  return (
    <p className="whitespace-pre-line text-sm leading-[22px] text-foreground">
      {block.content}
    </p>
  )
}

export default function ReviewQuestionCard({
  item,
}: ReviewQuestionCardProps) {
  const isCorrect = item.status === 'correct'
  const isWrong = item.status === 'wrong'

  const ExplanationIcon = isWrong ? ChartNoAxesColumn : BookOpen

  return (
    <article className="flex flex-col gap-5 rounded-2xl bg-card p-6 shadow-sm lg:p-7">
      {/* HEADING */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stroke pb-4">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-base font-bold text-white ${
              isWrong ? 'bg-[#b91c1c]' : 'bg-brand'
            }`}
          >
            {item.number}
          </span>

          <div>
            <h3 className="font-heading text-base font-semibold text-brand">
              Soal No. {item.number}
            </h3>

            <p className="text-[13px] text-foreground-muted">
              {item.topic}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-md bg-[#aeceff]/40 px-2.5 py-1 text-brand"
          >
            {item.difficulty === 'HOTS'
              ? 'Tingkat HOTS'
              : item.difficulty}
          </Badge>

          <Badge
            variant={isCorrect ? 'success' : 'muted'}
            className={`gap-1.5 rounded-md px-3 py-1 ${
              isCorrect
                ? 'bg-[#15803d]/10 text-[#15803d]'
                : isWrong
                  ? 'bg-[#b91c1c]/10 text-[#b91c1c]'
                  : 'bg-muted text-foreground-muted'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 size={16} />
            ) : (
              <XCircle size={16} />
            )}

            {isCorrect ? 'BENAR' : isWrong ? 'SALAH' : 'BELUM DIJAWAB'}
          </Badge>
        </div>
      </div>

      {/* QUESTION */}
      <p className="text-base leading-[26px] text-foreground">
        {item.question}
      </p>

      {item.image && (
        <figure className="overflow-hidden rounded-lg border border-stroke bg-muted p-2 sm:p-4">
          <img
            src={item.image.url}
            alt={item.image.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="mx-auto max-h-[28rem] w-full object-contain"
          />
        </figure>
      )}

      {/* ANSWERS */}
      <div className="grid grid-cols-1 gap-3 pt-1 md:grid-cols-2">
        <div
          className={`flex items-start gap-3 rounded-xl p-3.5 ${
            isCorrect
              ? 'bg-[#15803d]/5'
              : isWrong
                ? 'bg-[#b91c1c]/5'
                : 'bg-muted'
          }`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
              isCorrect
                ? 'bg-[#15803d]'
                : isWrong
                  ? 'bg-[#b91c1c]'
                  : 'bg-[#64748b]'
            }`}
          >
            {isCorrect ? <Check size={14} /> : <X size={14} />}
          </span>

          <div className="flex flex-col">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              Jawaban Anda
            </span>

            <strong
              className={`font-heading text-base ${
                isCorrect
                  ? 'text-[#15803d]'
                  : isWrong
                    ? 'text-[#b91c1c]'
                    : 'text-foreground'
              }`}
            >
              {item.studentAnswer}
            </strong>

            <span
              className={`text-[13px] ${
                isCorrect
                  ? 'text-[#15803d]'
                  : 'text-[#b91c1c]'
              }`}
            >
              {item.answerDescription}
            </span>
          </div>
        </div>

        <div
          className={`flex items-start gap-3 rounded-xl p-3.5 ${
            isCorrect ? 'bg-muted' : 'bg-[#15803d]/5'
          }`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${
              isCorrect ? 'bg-brand' : 'bg-[#15803d]'
            }`}
          >
            {isCorrect ? (
              <KeyRound size={14} />
            ) : (
              <Check size={14} />
            )}
          </span>

          <div className="flex flex-col">
            <span className="font-heading text-[11px] font-semibold uppercase text-foreground-muted">
              {isCorrect ? 'Kunci Jawaban Resmi' : 'Kunci Jawaban Benar'}
            </span>

            <strong
              className={`font-heading text-base ${
                isCorrect ? 'text-brand' : 'text-[#15803d]'
              }`}
            >
              {item.correctAnswer}
            </strong>

            {item.keyDescription && (
              <span className="text-[13px] text-foreground-muted">
                {item.keyDescription}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* EXPLANATION */}
      <div className="mt-2 flex flex-col gap-3 rounded-xl bg-muted p-5">
        <div className="flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wider text-brand">
          <ExplanationIcon
            size={18}
            className="text-brand-secondary"
          />
          {item.explanationTitle}
        </div>

        <div className="flex flex-col gap-2.5">
          {item.explanation.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              Pembahasan belum tersedia untuk soal ini.
            </p>
          ) : item.explanation.map((block, index) => (
            <ExplanationContent
              key={`${item.number}-${index}`}
              block={block}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
