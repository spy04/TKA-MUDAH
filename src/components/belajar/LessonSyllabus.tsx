
import {
  Check,
  CircleHelp,
  PlayCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import type {
  RuangBelajarData,
} from '../../services/ruangBelajarService'

type LessonSyllabusProps = {
  data: RuangBelajarData
  completed: boolean
}

export default function LessonSyllabus({
  data,
  completed,
}: LessonSyllabusProps) {
  const completedCount =
    data.completedLessons +
    (completed && !data.currentCompleted ? 1 : 0)

  return (
    <aside className="flex flex-col gap-4 lg:col-span-4">
      <section className="flex flex-col gap-4 rounded-xl border border-stroke bg-card p-4 shadow-sm">

        <div className="flex items-center justify-between gap-2 border-b border-stroke pb-2">
          <h2 className="font-heading text-base font-semibold text-brand">
            Daftar Materi
          </h2>

          <span className="font-heading text-[11px] font-semibold text-brand-secondary">
            {completedCount} / {data.totalLessons} Selesai
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {data.chapters.map((chapter) => {
            return (
              <div key={chapter.id} className="pb-1 pt-2">
                <div className="flex items-center justify-between gap-2 px-2.5 py-1">
                  <h3 className="font-heading text-base font-semibold text-brand">
                    Bab {chapter.id}: {chapter.title}
                  </h3>

                  <span className="shrink-0 font-mono text-xs text-brand-secondary">
                    {chapter.lessons.filter(
                      (lesson) =>
                        lesson.status === 'completed' ||
                        (lesson.status === 'current' && completed)
                    ).length}
                    /{chapter.lessons.length}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-col gap-1 pl-1.5">
                  {chapter.lessons.map((lesson) => {
                    const isCurrent = lesson.status === 'current'
                    const isCompleted =
                      lesson.status === 'completed' ||
                      (isCurrent && completed)

                    return (
                      <Link
                        to={`/belajar/${encodeURIComponent(data.slug)}?lessonId=${encodeURIComponent(lesson.lessonId)}`}
                        key={lesson.id}
                        aria-current={isCurrent ? 'step' : undefined}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 ${
                          isCurrent
                            ? 'bg-[#d4e3ff]/50 text-brand'
                            : 'text-foreground-muted hover:bg-muted'
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          {isCompleted ? (
                            <Check
                              size={16}
                              className="shrink-0 text-brand-secondary"
                            />
                          ) : (
                            <PlayCircle
                              size={18}
                              className="shrink-0 text-brand-secondary"
                            />
                          )}

                          <span
                            className={`truncate text-[13px] ${
                              isCurrent ? 'font-semibold text-brand' : ''
                            }`}
                          >
                            {lesson.id} {lesson.title}
                          </span>
                        </div>

                        <span className="shrink-0 font-mono text-xs text-[#75777e]">
                          {lesson.duration}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center border-t border-stroke pt-3 text-center">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-brand-secondary">
            <CircleHelp size={16} />
            Tanya guru bila ada materi yang belum dipahami
          </span>
        </div>
      </section>
    </aside>
  )
}
