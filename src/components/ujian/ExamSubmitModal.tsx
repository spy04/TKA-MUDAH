
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import Button from '../ui/Button'

type ExamSubmitModalProps = {
  open: boolean
  answeredCount: number
  flaggedCount: number
  unansweredCount: number
  totalQuestions: number
  submitting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ExamSubmitModal({
  open,
  answeredCount,
  flaggedCount,
  unansweredCount,
  totalQuestions,
  submitting = false,
  onClose,
  onConfirm,
}: ExamSubmitModalProps) {
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#00051b]/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
        aria-describedby="submit-modal-description"
        className="relative w-full max-w-md rounded-xl bg-card p-6 shadow-xl"
      >
        {/* MODAL HEADER */}
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffdad6] text-[#93000a]">
            <AlertTriangle size={24} />
          </div>

          <div>
            <h2
              id="submit-modal-title"
              className="font-heading text-lg font-bold text-foreground"
            >
              Konfirmasi Kumpulkan Ujian
            </h2>

            <p className="text-[11px] text-foreground-muted">
              Pastikan semua soal telah kamu periksa
            </p>
          </div>
        </div>

        {/* EXAM SUMMARY */}
        <div className="my-4 space-y-2 rounded-lg bg-muted p-4 text-[13px] text-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>Soal Dijawab:</span>

            <strong className="font-bold text-brand">
              {answeredCount} dari {totalQuestions}
            </strong>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Soal Ragu-ragu:</span>

            <strong className="font-bold text-brand-secondary">
              {flaggedCount} Soal
            </strong>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span>Belum Dijawab:</span>

            <strong className="font-bold text-red-600">
              {unansweredCount} Soal
            </strong>
          </div>

          <p
            id="submit-modal-description"
            className="pt-2 leading-5 text-foreground-muted"
          >
            Apakah kamu yakin ingin mengakhiri sesi simulasi ini
            sekarang? Jawaban akan dikunci setelah ujian
            dikumpulkan. Penilaian dan penerbitan hasil
            akan dinilai oleh sistem ujian.
          </p>
        </div>

        {/* MODAL ACTIONS */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            className="bg-stroke text-foreground hover:bg-muted"
          >
            Batal & Lanjutkan
          </Button>

          <Button
            type="button"
            disabled={submitting}
            variant="primary"
            size="md"
            onClick={onConfirm}
            className="bg-brand px-5 text-white shadow-sm hover:bg-[#001a52]"
          >
            {submitting ? 'Menyimpan hasil...' : 'Ya, Kumpulkan'}
          </Button>
        </div>
      </section>
    </div>
  )
}
