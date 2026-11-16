
import { ChevronDown } from 'lucide-react'

import Badge from '../../ui/Badge'
import LessonRow from './LessonRow'

import type { MateriChapter } from '../../../services/detailMateriService'

type ChapterCardProps = {
  chapter: MateriChapter
  open: boolean
  onToggle: () => void
}

export default function ChapterCard({
  chapter,
  open,
  onToggle,
}: ChapterCardProps) {
  return (
    <article className="overflow-hidden rounded-xl bg-card shadow-sm">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`chapter-content-${chapter.id}`}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-muted p-5 text-left transition-colors hover:bg-stroke"
      >
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand font-heading text-xs font-bold text-[#aeceff]">
            {String(chapter.id).padStart(2, '0')}
          </span>

          <div className="min-w-0">
            <h3 className="font-heading text-[17px] font-semibold leading-6 text-brand">
              {chapter.title}
            </h3>

            <p className="mt-1 text-[13px] text-foreground-muted">
              {chapter.lessons.length} Pembelajaran •{' '}
              {chapter.durationLabel}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Badge
            variant={chapter.id === 2 ? 'muted' : 'success'}
            className={`hidden sm:inline-flex ${
              chapter.id === 2
                ? 'bg-stroke text-foreground-muted'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {chapter.badge}
          </Badge>

          <ChevronDown
            size={22}
            className={`text-brand-secondary transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          id={`chapter-content-${chapter.id}`}
          className="divide-y divide-[#eceef0]"
        >
          {chapter.lessons.map((lesson) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
            />
          ))}
        </div>
      )}
    </article>
  )
}
