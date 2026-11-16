import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, BookOpen, ClipboardCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '../components/ui/Badge'
import ProgressBar from '../components/ui/ProgressBar'
import { getDashboardData, type DashboardData } from '../services/dashboardService'

function formatActivity(value: string | null) {
  if (!value) return 'Belum ada aktivitas'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export default function DashboardSiswa() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void getDashboardData()
      .then((result) => {
        if (active) setData(result)
      })
      .catch((caught: unknown) => {
        if (active) {
          setError(
            caught instanceof Error
              ? caught.message
              : 'Gagal memuat dashboard.'
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div role="status" className="mx-auto max-w-7xl px-4 py-12 text-sm text-foreground-muted">
        Memuat dashboard siswa...
      </div>
    )
  }
  if (error || !data) {
    return (
      <div role="alert" className="mx-auto max-w-7xl px-4 py-12 text-sm text-red-600">
        {error || 'Gagal memuat dashboard siswa.'}
      </div>
    )
  }

  const { overview, attempts } = data
  const name = overview.student.displayName.trim().split(/\s+/)[0] || 'Siswa'

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-home-border bg-card p-5 shadow-sm md:p-6">
        <Badge variant="secondary" rounded="full">
          Dashboard Siswa
        </Badge>
        <h1 className="mt-3 font-heading text-2xl font-bold text-brand">
          Halo, {name}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          {overview.student.educationLevel} Kelas {overview.student.grade}
          {overview.student.school ? ` • ${overview.student.school}` : ''}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard label="Materi dimulai" value={overview.summary.materials} />
          <SummaryCard label="Total pelajaran" value={overview.summary.totalLessons} />
          <SummaryCard label="Pelajaran selesai" value={overview.summary.completedLessons} />
          <SummaryCard label="Progres keseluruhan" value={`${overview.summary.progress}%`} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-brand">
            Progres Belajar
          </h2>
          <Link to="/materi" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary">
            Jelajahi materi <ArrowRight size={16} />
          </Link>
        </div>
        {overview.materials.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {overview.materials.map((material) => (
              <article key={material.id} className="rounded-xl border border-home-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-home-accent">
                      {material.subject} • {material.educationLevel} Kelas {material.grade}
                    </p>
                    <h3 className="mt-1 font-heading text-base font-bold text-brand">
                      {material.title}
                    </h3>
                  </div>
                  <Badge variant="muted" className="shrink-0">
                    {material.accessTier === 'PREMIUM' ? 'Premium' : 'Gratis'}
                  </Badge>
                </div>
                <div className="mt-4">
                  <ProgressBar value={material.progress} label="Progres materi" showValue />
                </div>
                <p className="mt-3 text-xs text-foreground-muted">
                  {material.completedLessons} dari {material.totalLessons} pelajaran selesai
                  {' • '}Terakhir diakses {formatActivity(material.lastActivity)}
                </p>
                <Link
                  to={`/belajar/${material.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary"
                >
                  Lanjut belajar <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen size={22} />}
            text="Belum ada progres belajar. Pilih materi untuk mulai belajar."
          />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-brand">
            Riwayat Latihan dan Ujian
          </h2>
          <Link to="/latihan" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-secondary">
            Paket latihan <ArrowRight size={16} />
          </Link>
        </div>
        {attempts.length ? (
          <div className="overflow-hidden rounded-xl border border-home-border bg-card shadow-sm">
            {attempts.map((attempt) => {
              const inProgress = attempt.status === 'IN_PROGRESS'
              const target = inProgress
                ? `/ujian/simulasi/${attempt.packageId}`
                : `/latihan/hasil/${attempt.id}`
              return (
                <Link
                  key={attempt.id}
                  to={target}
                  className="flex flex-col gap-2 border-b border-home-border p-4 last:border-b-0 hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-brand-secondary">
                      <ClipboardCheck size={19} />
                    </span>
                    <div>
                      <h3 className="font-heading text-sm font-semibold text-brand">
                        {attempt.title}
                      </h3>
                      <p className="mt-1 text-xs text-foreground-muted">
                        {formatDate(attempt.startedAt)} • {attempt.kind === 'SIMULATION' ? 'Simulasi' : 'Latihan'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-brand-secondary">
                    {inProgress
                      ? 'Lanjutkan'
                      : attempt.score === null
                        ? 'Lihat hasil'
                        : `Nilai ${attempt.score}`}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<ClipboardCheck size={22} />}
            text="Belum ada riwayat latihan atau ujian."
          />
        )}
      </section>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-muted p-3.5">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className="mt-1 font-heading text-xl font-bold text-brand">{value}</p>
    </div>
  )
}

function EmptyState({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-home-border bg-card p-5 text-sm text-foreground-muted">
      <span className="text-brand-secondary">{icon}</span>
      {text}
    </div>
  )
}

