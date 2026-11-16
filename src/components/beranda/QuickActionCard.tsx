
import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '../ui/Badge'

type QuickActionCardProps = {
  title: string
  description: string
  badge: string
  to: string
  icon: LucideIcon
  variant?: 'blue' | 'navy'
}

export default function QuickActionCard({
  title,
  description,
  badge,
  to,
  icon: Icon,
  variant = 'blue',
}: QuickActionCardProps) {
  const isBlue = variant === 'blue'

  return (
    <Link
      to={to}
      className="group flex h-full flex-col justify-between rounded-xl border border-home-border bg-card p-4 shadow-sm transition-colors hover:border-slate-300 sm:p-5"
    >
      <div>
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
              isBlue
                ? 'bg-home-accent-soft text-home-accent'
                : 'bg-slate-100 text-brand'
            }`}
          >
            <Icon size={20} />
          </div>

          <Badge
            variant="muted"
            className={
              isBlue
                ? 'bg-home-accent-soft text-home-accent'
                : 'bg-slate-100 text-slate-700'
            }
          >
            {badge}
          </Badge>
        </div>

        <h2 className="font-heading text-sm font-bold text-home-text transition-colors group-hover:text-home-accent">
          {title}
        </h2>
      </div>

      <div
        className={`mt-3.5 flex items-center justify-between border-t border-home-border pt-2.5 text-xs font-semibold transition-colors group-hover:text-home-accent ${
          isBlue ? 'text-home-accent' : 'text-brand'
        }`}
      >
        <span>{description}</span>

        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </Link>
  )
}
