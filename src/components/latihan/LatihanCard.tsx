
import {
  ArrowRight,
  ClipboardList,
  Clock3,
  LockKeyhole,
  LockOpen,
} from 'lucide-react'

import Badge from '../ui/Badge'
import Button from '../ui/Button'

import type { PaketLatihan } from '../../services/latihanService'

type LatihanCardProps = {
  item: PaketLatihan
}

const difficultyColors: Record<PaketLatihan['tingkat'], string> = {
  Mudah: 'bg-emerald-500',
  Sedang: 'bg-amber-500',
  Sulit: 'bg-red-600',
}

const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

export default function LatihanCard({
  item,
}: LatihanCardProps) {
  const premium = item.akses === 'Premium'

  return (
    <article className="group flex h-full flex-col justify-between rounded-xl bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge
            variant="muted"
            className="bg-muted px-2.5 py-1 text-brand-secondary"
          >
            {item.mataPelajaran} • {item.kelas}
          </Badge>

          <Badge
            variant={premium ? 'warning' : 'success'}
            className={`gap-1 uppercase tracking-wide ${
              premium
                ? 'bg-amber-50 text-amber-800'
                : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {premium && <LockKeyhole size={14} />}
            {item.akses}
          </Badge>
        </div>

        <h2 className="mb-2 line-clamp-2 font-heading text-lg font-bold leading-6 text-brand transition-colors group-hover:text-brand-secondary">
          {item.judul}
        </h2>

        <p className="mb-4 line-clamp-2 text-[13px] leading-[18px] text-foreground-muted">
          {item.deskripsi}
        </p>

        <div className="mb-5 flex flex-wrap items-center gap-4 rounded-lg bg-muted/60 px-3 py-2.5 text-foreground-muted">
          <span className="flex items-center gap-1.5 font-heading text-xs font-semibold">
            <ClipboardList
              size={18}
              className="text-brand-secondary"
            />
            {item.jumlahSoal} Soal
          </span>

          <span className="flex items-center gap-1.5 font-heading text-xs font-semibold">
            <Clock3
              size={18}
              className="text-brand-secondary"
            />
            {item.durasiMenit} Menit
          </span>

          <span className="ml-auto flex items-center gap-1.5 font-heading text-xs font-medium text-foreground">
            <span
              className={`h-2 w-2 rounded-full ${
                difficultyColors[item.tingkat]
              }`}
            />
            {item.tingkat}
          </span>
        </div>
      </div>

      <div className="pt-2">
        {premium && (
          <div className="mb-2 flex items-center justify-between gap-2 px-1">
            <span className="text-[13px] text-foreground-muted">
              Akses premium
            </span>

            <span className="font-heading text-xs font-bold text-brand">
              {item.harga === undefined
                ? 'Harga belum ditentukan'
                : formatRupiah(item.harga)}
            </span>
          </div>
        )}

        {item.id ? (
          <Button
            to={`/ujian/simulasi/${item.id}`}
            variant="primary"
            className="w-full bg-brand py-2.5 shadow-sm hover:bg-brand-dark"
          >
            {item.kind === 'SIMULATION' ? 'Mulai Simulasi' : 'Mulai Latihan'}
            <ArrowRight size={18} />
          </Button>
        ) : (
          <Button
            type="button"
            disabled
            variant={premium ? 'secondary' : 'primary'}
            title={
              premium
                ? 'Pembelian akses belum tersedia'
                : 'Soal latihan belum tersedia'
            }
            className={`w-full py-2.5 shadow-sm ${
              premium
                ? 'bg-stroke text-brand'
                : 'bg-brand text-white'
            }`}
          >
            {premium ? (
              <>
                <LockOpen size={18} />
                Buka Latihan
              </>
            ) : (
              <>
                Mulai Latihan
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        )}
      </div>
    </article>
  )
}
