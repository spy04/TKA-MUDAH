
import { Play } from 'lucide-react'

import Button from '../ui/Button'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

import type { LearningItem } from '../../services/berandaService'

type LearningCardProps = {
  item: LearningItem
}

export default function LearningCard({
  item,
}: LearningCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-xl border border-home-border bg-card p-4 shadow-sm">
      <div>
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-wide text-home-accent">
              {item.subject} • Kelas {item.grade}
            </span>

            <h3 className="mt-0.5 font-heading text-sm font-bold leading-5 text-home-text">
              {item.title}
            </h3>
          </div>

          <Badge
            variant="muted"
            className="shrink-0 bg-home-subtle text-home-muted"
          >
            {item.level} • Kelas {item.grade}
          </Badge>
        </div>

        {item.chapter && (
          <p className="mb-3 text-xs leading-5 text-home-muted">
            {item.chapter}
          </p>
        )}

        <div className="mb-3">
          <ProgressBar
            value={item.progress}
            label="Progres Pembelajaran"
            variant="secondary"
            showValue
            className="[&_[role=progressbar]]:bg-home-subtle [&_[role=progressbar]>div]:bg-home-accent"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <span className="text-[11px] text-home-muted">
          Terakhir diakses {item.lastActivity}
        </span>

        <Button
          to={`/belajar/${item.slug}`}
          size="sm"
          className="bg-brand hover:bg-home-primary-light"
        >
          <Play size={14} fill="currentColor" />
          Lanjut Belajar
        </Button>
      </div>
    </article>
  )
}
