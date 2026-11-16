
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  PlayCircle,
} from 'lucide-react'

import Badge from '../../ui/Badge'
import Button from '../../ui/Button'

import type { MateriLesson } from '../../../services/detailMateriService'

type LessonRowProps = {
  lesson: MateriLesson
}

export default function LessonRow({
  lesson,
}: LessonRowProps) {
  const LessonIcon =
    lesson.type === 'quiz'
      ? ClipboardList
      : lesson.type === 'reading'
        ? BookOpen
        : PlayCircle

  const isOpen = lesson.access === 'open'

  return (
    <div className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/50 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <LessonIcon
          size={20}
          className="shrink-0 text-brand-secondary"
        />

        <div className="min-w-0">
          <h4 className="truncate text-sm font-medium text-brand">
            {lesson.id} {lesson.title}
          </h4>

          <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            <span>{lesson.description}</span>
            <span>•</span>
            <span>{lesson.durationMinutes} menit</span>
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Badge
          variant={isOpen ? 'success' : 'muted'}
          className={`hidden px-2.5 py-0.5 sm:inline-flex ${
            isOpen
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-stroke text-foreground-muted'
          }`}
        >
          {isOpen ? 'Terbuka' : 'Tersedia'}
        </Badge>

        <Button
          to={lesson.path}
          variant="ghost"
          size="sm"
          className="gap-0.5 px-0 text-brand-secondary hover:bg-transparent hover:text-brand"
        >
          {lesson.action}
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
