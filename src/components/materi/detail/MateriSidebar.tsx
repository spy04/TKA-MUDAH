
import {
  BookOpen,
  CircleHelp,
  Info,
  Share2,
  Video,
} from 'lucide-react'

import Badge from '../../ui/Badge'
import Button from '../../ui/Button'

import type { DetailMateriData } from '../../../services/detailMateriService'

type MateriSidebarProps = {
  data: DetailMateriData
  onShare: () => void
  shareStatus: string
}

export default function MateriSidebar({
  data,
  onShare,
  shareStatus,
}: MateriSidebarProps) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-20 lg:col-span-4">
      {/* ACCESS CARD */}
      <section className="rounded-xl bg-card p-6 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#eceef0] pb-4">
          <Badge
            variant="success"
            className="gap-1.5 bg-emerald-50 px-2.5 py-1 text-emerald-700"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {data.access.free
              ? 'Akses Gratis Tersedia'
              : 'Akses Premium'}
          </Badge>

          <span className="font-heading text-[11px] font-semibold text-brand-secondary">
            {data.access.free ? 'Materi tersedia' : 'Akses aktif'}
          </span>
        </div>

        <div className="mb-5">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-heading text-[32px] font-extrabold leading-none text-brand">
              {data.access.free ? 'Gratis' : 'Premium'}
            </span>

            {data.access.free && (
              <span className="text-[13px] text-foreground-muted">
                / Terbuka untuk seluruh siswa
              </span>
            )}
          </div>

          <p className="mt-1.5 text-[13px] leading-5 text-brand-secondary">
            {data.access.description}
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <Button
            to={`/belajar/${data.slug}`}
            variant="primary"
            size="lg"
            className="w-full bg-brand text-lg shadow-sm hover:bg-brand-dark"
          >
            <Video size={20} className="text-[#aeceff]" />
            Mulai Belajar Sekarang
          </Button>

          <Button
            type="button"
            disabled
            title="Fitur daftar belajar belum tersedia"
            variant="secondary"
            size="md"
            className="w-full bg-muted py-2.5 text-xs text-brand hover:bg-stroke"
          >
            Simpan ke Daftar Belajar
          </Button>
        </div>

        {/* FACILITIES */}
        {data.access.facilities.length > 0 && (
        <div className="space-y-3 border-t border-[#eceef0] pt-5">
          <h3 className="font-heading text-[11px] font-bold uppercase tracking-wider text-brand">
            Fasilitas Paket Materi:
          </h3>

          <ul className="space-y-2.5">
            {data.access.facilities.map((facility) => {
              return (
                <li
                  key={facility}
                  className="flex items-start gap-2.5 text-[13px] text-foreground-muted"
                >
                  <span>{facility}</span>
                </li>
              )
            })}
          </ul>
        </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#eceef0] pt-4 text-xs text-foreground-muted">
          <span className="inline-flex items-center gap-1">
            <Info size={15} className="text-brand-secondary" />
            {data.level}
          </span>

          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-1 hover:text-brand"
          >
            <Share2 size={15} />
            Bagikan
          </button>
        </div>

        {shareStatus && (
          <p
            role="status"
            className="mt-2 text-xs text-brand-secondary"
          >
            {shareStatus}
          </p>
        )}
      </section>

      {/* INSTRUCTOR CARD */}
      {data.instructor && (
      <section className="rounded-xl bg-card p-6 shadow-sm">
        <span className="mb-3 block font-heading text-[10px] font-bold uppercase tracking-wider text-brand-secondary">
          Guru Pengampu Mata Pelajaran
        </span>

        <div className="mb-3.5 flex items-center gap-3.5">
          {data.instructor.imageUrl && (
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-stroke shadow-sm">
              <img
                src={data.instructor.imageUrl}
                alt={`Foto ${data.instructor.name}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div>
            <h3 className="font-heading text-base font-semibold leading-5 text-brand">
              {data.instructor.name}
            </h3>

            <p className="mt-0.5 text-xs leading-4 text-brand-secondary">
              {data.instructor.role}
            </p>
          </div>
        </div>

        <p className="text-[13px] leading-5 text-foreground-muted">
          {data.instructor.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#eceef0] pt-3 text-xs">
          <span className="inline-flex items-center gap-1 font-medium text-brand">
            <BookOpen size={16} className="text-brand-secondary" />
            Pengajar materi
          </span>

          <span className="text-foreground-muted">
            {data.instructor.expertise}
          </span>
        </div>
      </section>
      )}

      {/* HELP CARD */}
      <section className="flex items-start gap-3 rounded-xl bg-muted p-5 text-foreground-muted">
        <CircleHelp
          size={22}
          className="mt-0.5 shrink-0 text-brand-secondary"
        />

        <div className="text-[13px] leading-5">
          <h3 className="font-semibold text-brand">
            Ada pertanyaan terkait materi ini?
          </h3>

          <p>
            Forum diskusi dan bantuan guru belum tersedia pada materi ini.
          </p>
        </div>
      </section>
    </aside>
  )
}
