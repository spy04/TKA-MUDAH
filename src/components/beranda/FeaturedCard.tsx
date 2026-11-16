
import {
  BookOpen,
} from 'lucide-react'

import Badge from '../ui/Badge'
import Button from '../ui/Button'

import type { FeaturedItem } from '../../services/berandaService'

type FeaturedCardProps = {
  item: FeaturedItem
}

function formatPrice(price: number) {
  return `Rp ${Math.round(price / 1000)}rb`
}

export default function FeaturedCard({
  item,
}: FeaturedCardProps) {
  const premium = item.access === 'premium'

  const destination = `/materi/${item.slug}`

  return (
    <article className="group flex h-full flex-col justify-between overflow-hidden rounded-xl border border-home-border bg-card shadow-sm transition-colors hover:border-slate-300">
      <div>
        <div className="relative h-32 overflow-hidden bg-home-subtle">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen
                size={36}
                className="text-home-muted"
              />
            </div>
          )}

          <div className="absolute left-2.5 top-2.5">
            <Badge
              variant="muted"
              className="border border-home-border bg-white/95 text-[10px] text-brand"
            >
              {item.badge}
            </Badge>
          </div>

          <div className="absolute right-2.5 top-2.5">
            <Badge
              variant={premium ? 'premium' : 'secondary'}
              rounded="full"
              className={`border text-[10px] ${
                premium
                  ? 'border-brand bg-brand text-white'
                  : 'border-home-accent-subtle bg-home-accent-soft text-home-accent'
              }`}
            >
              {premium
                ? `Premium${
                    item.price !== null
                      ? ` • ${formatPrice(item.price)}`
                      : ''
                  }`
                : 'Gratis'}
            </Badge>
          </div>
        </div>

        <div className="p-3.5">
          <span
            className={`mb-0.5 block text-[11px] font-semibold ${
              premium
                ? 'text-amber-600'
                : 'text-home-accent'
            }`}
          >
            {item.category}
          </span>

          <h3 className="line-clamp-2 font-heading text-xs font-bold leading-snug text-home-text">
            {item.title}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-home-muted">
            {item.metrics.map((metric, index) => {
              return (
                <span
                  key={`${metric.label}-${index}`}
                  className="flex items-center gap-1"
                >
                  <BookOpen size={14} />
                  {metric.value && `${metric.value} `}
                  {metric.label}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="p-3.5 pt-0">
        <Button
          to={destination}
          variant={premium ? 'primary' : 'outline'}
          size="sm"
          className={`w-full ${
            premium
              ? 'bg-brand hover:bg-home-primary-light'
              : 'border-home-border bg-card text-brand hover:bg-home-subtle'
          }`}
        >
          Mulai Belajar
        </Button>
      </div>
    </article>
  )
}
