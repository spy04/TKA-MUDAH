import { useEffect, useRef, useState } from 'react'
import {
  Download,
  Lightbulb,
  MessageCircle,
  PlayCircle,
  Plus,
  Trash2,
} from 'lucide-react'

import Badge from '../ui/Badge'
import Button from '../ui/Button'

import {
  createLessonNote,
  deleteLessonNote,
  type LearningNote,
  type RuangBelajarData,
} from '../../services/ruangBelajarService'

type Tab = 'summary' | 'notes' | 'discussion' | 'resources'

type LessonWorkspaceProps = {
  data: RuangBelajarData
  noteTimestamp: number | null
  onNoteHandled: () => void
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(
    Math.floor(seconds % 60)
  ).padStart(2, '0')}`
}

export default function LessonWorkspace({
  data,
  noteTimestamp,
  onNoteHandled,
}: LessonWorkspaceProps) {
  const [tab, setTab] = useState<Tab>('summary')
  const [notes, setNotes] = useState<LearningNote[]>(data.initialNotes)
  const [noteText, setNoteText] = useState('')
  const [activeTimestamp, setActiveTimestamp] = useState(data.initialPosition)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const noteInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (noteTimestamp === null) return
    setTab('notes')
    setActiveTimestamp(noteTimestamp)
    onNoteHandled()
  }, [noteTimestamp, onNoteHandled])

  useEffect(() => {
    if (tab === 'notes' && noteTimestamp === null) {
      noteInputRef.current?.focus()
    }
  }, [tab, noteTimestamp])

  async function saveNote() {
    const text = noteText.trim()
    if (!text || saving) return
    setSaving(true)
    setError('')
    try {
      const newNote = await createLessonNote(data.lessonId, activeTimestamp, text)
      setNotes((current) => [newNote, ...current])
      setNoteText('')
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Gagal menyimpan catatan.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function removeNote(noteId: string) {
    setError('')
    try {
      await deleteLessonNote(data.lessonId, noteId)
      setNotes((current) => current.filter((note) => note.id !== noteId))
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Gagal menghapus catatan.'
      )
    }
  }

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'summary', label: 'Ikhtisar & Rangkuman' },
    { id: 'notes', label: 'Catatan Saya', count: notes.length },
    { id: 'discussion', label: 'Diskusi & Tanya Soal' },
    { id: 'resources', label: 'Unduhan Materi' },
  ]

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-sm">
      <div
        role="tablist"
        aria-label="Informasi pelajaran"
        className="flex items-center gap-2 overflow-x-auto border-b border-stroke pb-2"
      >
        {tabs.map((item) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => setTab(item.id)}
            className={`shrink-0 rounded-md px-3.5 py-1.5 font-heading text-sm font-semibold transition-colors ${
              tab === item.id
                ? 'bg-soft-blue text-brand'
                : 'text-foreground-muted hover:text-brand'
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <Badge
                variant="muted"
                rounded="full"
                className="ml-1 bg-stroke px-1.5 font-mono text-[10px]"
              >
                {item.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {tab === 'summary' && (
        <div
          id="panel-summary"
          role="tabpanel"
          aria-labelledby="tab-summary"
          className="flex flex-col gap-4 pt-2"
        >
          <div className="flex items-start gap-3 rounded-lg border border-[#d4e3ff] bg-[#d4e3ff]/50 p-4">
            <Lightbulb size={20} className="mt-0.5 shrink-0 text-brand-secondary" />
            <div className="space-y-3">
              <div>
                <h3 className="font-heading text-xs font-semibold text-brand">
                  Tujuan Pembelajaran
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-foreground-muted">
                  {data.objective || 'Tujuan pembelajaran belum tersedia.'}
                </p>
              </div>
              <div>
                <h3 className="font-heading text-xs font-semibold text-brand">
                  Rangkuman
                </h3>
                <p className="mt-1 whitespace-pre-line text-[13px] leading-5 text-foreground-muted">
                  {data.summary || 'Rangkuman untuk pelajaran ini belum tersedia.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'notes' && (
        <div
          id="panel-notes"
          role="tabpanel"
          aria-labelledby="tab-notes"
          className="space-y-4 pt-2"
        >
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center gap-2">
              <PlayCircle size={16} className="text-brand-secondary" />
              <span className="font-mono text-xs font-semibold text-brand-secondary">
                Catatan di menit {formatTime(activeTimestamp)}
              </span>
            </div>
            <textarea
              ref={noteInputRef}
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              rows={3}
              placeholder={`Catatan di menit ${formatTime(activeTimestamp)}: ...`}
              className="w-full resize-y rounded-lg border border-stroke bg-card p-3 text-sm text-foreground outline-none focus:border-brand-secondary"
            />
            <div className="mt-3 flex justify-end">
              <Button
                onClick={() => void saveNote()}
                disabled={!noteText.trim() || saving}
                size="sm"
              >
                <Plus size={15} />
                {saving ? 'Menyimpan...' : 'Simpan Catatan'}
              </Button>
            </div>
          </div>

          {notes.length === 0 ? (
            <p className="py-4 text-center text-sm text-foreground-muted">
              Belum ada catatan. Catatan yang dibuat akan tersimpan di akunmu.
            </p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="rounded-xl border border-stroke bg-card p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 font-mono text-xs font-semibold text-brand-secondary">
                      <PlayCircle size={16} />
                      {formatTime(note.timestamp)}
                    </span>
                    <button
                      type="button"
                      onClick={() => void removeNote(note.id)}
                      aria-label="Hapus catatan"
                      className="text-foreground-muted hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground">
                    {note.text}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'discussion' && (
        <div
          id="panel-discussion"
          role="tabpanel"
          aria-labelledby="tab-discussion"
          className="flex flex-col items-center gap-2 py-10 text-center"
        >
          <MessageCircle size={28} className="text-brand-secondary" />
          <h3 className="font-heading text-sm font-semibold text-brand">
            Diskusi & Tanya Soal
          </h3>
          <p className="text-[13px] text-foreground-muted">
            Forum diskusi belum tersedia.
          </p>
        </div>
      )}

      {tab === 'resources' && (
        <div
          id="panel-resources"
          role="tabpanel"
          aria-labelledby="tab-resources"
          className="flex flex-col items-center gap-2 py-10 text-center"
        >
          <Download size={28} className="text-brand-secondary" />
          <h3 className="font-heading text-sm font-semibold text-brand">
            Unduhan Materi
          </h3>
          <p className="text-[13px] text-foreground-muted">
            Belum ada dokumen materi yang tersedia untuk diunduh.
          </p>
        </div>
      )}
    </section>
  )
}

