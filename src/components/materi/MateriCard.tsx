
import {
  BookOpen,
  FileText,
  LockKeyhole,
  PlayCircle,
} from 'lucide-react'

import Button from '../ui/Button'
import Badge from '../ui/Badge'

import type { Materi } from '../../services/materiService'

type MateriCardProps = {
  item: Materi
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

export default function MateriCard({
  item,
}: MateriCardProps) {
  const isPremium = item.akses === 'premium'

  const destination = `/materi/${item.slug}`

  return (
    <article className="group flex h-full flex-col justify-between overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-200 hover:shadow-md">
      <div>
        {/* Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#eceef0]">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.judul}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen
                size={44}
                className="text-brand-secondary"
              />
            </div>
          )}

          {/* Access */}
          <div className="absolute right-3 top-3">
            <Badge
              variant={isPremium ? 'premium' : 'secondary'}
              className={`gap-1 rounded px-2.5 py-0.5 uppercase tracking-wide shadow-sm ${
                isPremium
                  ? 'bg-brand text-white'
                  : 'bg-soft-blue text-brand-secondary'
              }`}
            >
              {isPremium && <LockKeyhole size={13} />}
              {isPremium ? 'Premium' : 'Gratis'}
            </Badge>
          </div>

          {/* Subject Category */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="primary"
              className="rounded bg-[#000615]/80 px-2.5 py-1 text-white backdrop-blur-sm"
            >
              {item.kategoriLabel}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="muted"
              className="bg-[#e6e8ea] text-foreground-muted"
            >
              {item.kelasLabel}
            </Badge>

            <span className="text-xs text-[#75777e]">
              {item.kurikulum ? '•' : ''}
            </span>

            {item.kurikulum && (
              <span className="text-[13px] text-foreground-muted">
                {item.kurikulum}
              </span>
            )}
          </div>

          <h2 className="line-clamp-2 font-heading text-[16px] font-semibold leading-[22px] text-foreground transition-colors group-hover:text-brand-secondary">
            {item.judul}
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[13px] text-foreground-muted">
            <span className="inline-flex items-center gap-1.5">
              <PlayCircle
                size={16}
                className="text-brand-secondary"
              />
              {item.jumlahVideo} {item.labelVideo}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <FileText size={16} className="text-brand-secondary" />
              {item.jumlahLatihan} {item.labelLatihan}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card px-5 pb-5 pt-2">
        {isPremium ? (
          <div className="flex flex-col">
            <span className="font-heading text-[11px] font-bold text-foreground-muted">
              Biaya Akses Penuh
            </span>

            <span className="font-heading text-[18px] font-bold leading-6 text-brand">
              {item.harga === undefined
                ? 'Hubungi Admin'
                : formatRupiah(item.harga)}
            </span>
          </div>
        ) : (
          <div className="text-[13px] text-foreground-muted">
            {item.jumlahSiswa} siswa memulai
          </div>
        )}

        <Button
          to={destination}
          variant={isPremium ? 'primary' : 'secondary'}
          size="md"
          className={`shadow-sm ${
            isPremium
              ? 'bg-brand hover:bg-[#001a52]'
              : 'bg-muted text-brand hover:bg-[#eceef0]'
          }`}
        >
          {isPremium ? 'Lihat Modul' : 'Mulai Belajar'}
        </Button>
      </div>
    </article>
  )
}
