
function Skeleton({
  className = '',
}: {
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
    />
  )
}

function GradeSelectorSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-home-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-home-border bg-home-subtle p-3"
          >
            <Skeleton className="mx-auto mb-2 h-3 w-8" />
            <Skeleton className="mx-auto h-2.5 w-14" />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-3 border-t border-home-border pt-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

function QuickActionSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-home-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>

      <Skeleton className="mt-3 h-4 w-36" />

      <div className="mt-4 flex items-center justify-between border-t border-home-border pt-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  )
}

function LearningCardSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-home-border bg-card p-4 shadow-sm">
      <div>
        <div className="flex justify-between gap-3">
          <div className="flex-1">
            <Skeleton className="mb-2 h-3 w-28" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        <Skeleton className="mt-3 h-3 w-2/3" />

        <div className="mt-5">
          <div className="mb-2 flex justify-between">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  )
}

function FeaturedCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-home-border bg-card shadow-sm">
      <Skeleton className="h-32 w-full rounded-none" />

      <div className="flex flex-1 flex-col p-3.5">
        <Skeleton className="mb-2 h-3 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-3/4" />

        <div className="mt-4 flex gap-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>

        <Skeleton className="mt-6 h-9 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function BerandaSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat halaman beranda"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 md:py-8"
    >
      <span className="sr-only">Memuat beranda...</span>

      {/* 1. Welcome & Search */}
      <section className="rounded-xl border border-home-border bg-card p-5 shadow-sm md:p-6">
        <Skeleton className="mb-3 h-3 w-48" />
        <Skeleton className="h-7 w-full max-w-md" />

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 min-w-0 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg sm:w-32" />
        </div>
      </section>

      {/* 2. Grade & Quick Actions */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <GradeSelectorSkeleton />
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
          <QuickActionSkeleton />
          <QuickActionSkeleton />
        </section>
      </div>

      {/* 3. Continue Learning */}
      <section>
        <div className="mb-3.5 flex items-center justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <LearningCardSkeleton key={index} />
          ))}
        </div>
      </section>

      {/* 4. Featured Materials */}
      <section>
        <div className="mb-3.5 flex items-center justify-between">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-3 w-56" />
          </div>

          <Skeleton className="h-3 w-24" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <FeaturedCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  )
}
