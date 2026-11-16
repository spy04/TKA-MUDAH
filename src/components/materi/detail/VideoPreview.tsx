
import { useState } from 'react'
import { BookOpen, Play } from 'lucide-react'

import LessonPlayer from '../../belajar/LessonPlayer'
import type { DetailMateriData } from '../../../services/detailMateriService'

type VideoPreviewProps = {
  imageUrl: DetailMateriData['imageUrl']
  shortTitle: DetailMateriData['shortTitle']
  preview: DetailMateriData['preview']
}

export default function VideoPreview({
  imageUrl,
  shortTitle,
  preview,
}: VideoPreviewProps) {
  const [started, setStarted] = useState(false)
  const canPlay = preview.available && Boolean(preview.videoUrl)

  if (started && canPlay) {
    return (
      <LessonPlayer
        key={preview.videoUrl}
        data={{
          lessonId: 'material-preview',
          lessonTitle: shortTitle,
          lessonLabel: shortTitle,
          courseLabel: 'Cuplikan materi',
          posterUrl: imageUrl,
          videoUrl: preview.videoUrl,
          initialPosition: 0,
          duration: preview.durationSeconds,
        }}
        preview={preview.restricted}
        onPositionChange={() => {}}
      />
    )
  }

  return (
    <section className="group relative aspect-video w-full overflow-hidden rounded-xl bg-brand shadow-md">
      <img
        src={imageUrl || undefined}
        alt={`Ilustrasi ${shortTitle}`}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-[#000615]/60 backdrop-blur-[2px]" />

      <div className="absolute left-4 top-4">
        <span className="inline-flex items-center gap-1.5 rounded bg-white/90 px-2.5 py-1 font-heading text-[11px] font-semibold text-brand shadow-sm backdrop-blur-sm">
          <BookOpen size={13} />
          Materi Pembelajaran
        </span>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {canPlay ? (
          <button
            type="button"
            aria-label="Tonton Cuplikan Video"
            onClick={() => setStarted(true)}
            className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand shadow-xl transition-transform duration-300 group-hover:scale-110"
          >
            <Play
              size={32}
              fill="currentColor"
              className="translate-x-0.5 text-brand-secondary"
            />
          </button>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Tonton Cuplikan Video"
            title="Video preview belum tersedia"
            className="mb-3 flex h-16 w-16 cursor-not-allowed items-center justify-center rounded-full bg-white text-brand shadow-xl"
          >
            <Play
              size={32}
              fill="currentColor"
              className="translate-x-0.5 text-brand-secondary"
            />
          </button>
        )}

        <span className="font-heading text-lg font-bold text-white drop-shadow">
          {canPlay ? 'Tonton Materi' : 'Pratinjau video belum tersedia'}
        </span>

        <span className="mt-0.5 text-[13px] text-white/90 drop-shadow">
          {shortTitle}
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-[11px] font-semibold text-white/90">
        <span className="inline-flex items-center gap-1">
          {canPlay ? 'Video materi tersedia' : 'Konten video belum disediakan'}
        </span>
      </div>
    </section>
  )
}
