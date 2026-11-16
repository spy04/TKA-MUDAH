
import { useEffect, useRef, useState } from 'react'
import {
  Maximize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  StickyNote,
} from 'lucide-react'

import type { RuangBelajarData } from '../../services/ruangBelajarService'

type LessonPlayerProps = {
  data: RuangBelajarData
  onTakeNote: (seconds: number) => void
  onPositionChange: (seconds: number, force?: boolean) => void
}

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safe / 60)
  const remaining = safe % 60

  return `${minutes}:${String(remaining).padStart(2, '0')}`
}

export default function LessonPlayer({
  data,
  onTakeNote,
  onPositionChange,
}: LessonPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(data.initialPosition)
  const [duration, setDuration] = useState(data.duration)
  const [volume, setVolume] = useState(0.8)
  const [speed, setSpeed] = useState(1.25)
  const positionRef = useRef(data.initialPosition)
  const onPositionChangeRef = useRef(onPositionChange)
  onPositionChangeRef.current = onPositionChange

  useEffect(() => {
    function savePositionOnExit() {
      onPositionChangeRef.current(positionRef.current, true)
    }

    window.addEventListener('pagehide', savePositionOnExit)
    return () => window.removeEventListener('pagehide', savePositionOnExit)
  }, [data.lessonId])

  const hasVideo = Boolean(data.videoUrl)
  const percentage =
    duration > 0 ? (position / duration) * 100 : 0

  async function togglePlayback() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
    }
  }

  function seek(seconds: number) {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(
      0,
      Math.min(video.duration || data.duration, seconds)
    )
    positionRef.current = video.currentTime
    setPosition(video.currentTime)
    onPositionChange(video.currentTime)
  }

  function changeSpeed() {
    const rates = [1, 1.25, 1.5, 2]
    const next = rates[(rates.indexOf(speed) + 1) % rates.length]

    setSpeed(next)

    if (videoRef.current) {
      videoRef.current.playbackRate = next
    }
  }

  async function fullscreen() {
    if (!hasVideo) return
    await videoRef.current?.requestFullscreen()
  }

  return (
    <section
      aria-label="Pemutar video pembelajaran"
      className="group relative aspect-video w-full select-none overflow-hidden rounded-xl bg-[#000615] shadow-xl"
    >
      {hasVideo ? (
        <video
          ref={videoRef}
          src={data.videoUrl!}
          poster={data.posterUrl}
          preload="metadata"
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget
            setDuration(video.duration)
            video.volume = volume
            video.playbackRate = speed
          }}
          onTimeUpdate={(event) => {
            const next = event.currentTarget.currentTime
            positionRef.current = next
            setPosition(next)
            onPositionChange(next)
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={(event) => {
            setPlaying(false)
            const next = event.currentTarget.currentTime
            positionRef.current = next
            setPosition(next)
            onPositionChange(next, true)
          }}
        />
      ) : (
        <img
          src={data.posterUrl}
          alt={`Ilustrasi materi ${data.lessonTitle}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000615]/95 via-[#000615]/30 to-[#000615]/60" />

      {/* Lesson information */}
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex flex-wrap items-start justify-between gap-2 text-white">
        <span className="inline-flex items-center gap-2 rounded-lg bg-[#000615]/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
          {data.lessonLabel}
        </span>

        <span className="rounded bg-white/15 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur-md">
          {data.courseLabel}
        </span>
      </div>

      {/* Center play */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <button
          type="button"
          aria-label={playing ? 'Jeda video' : 'Putar video'}
          disabled={!hasVideo}
          onClick={() => void togglePlayback()}
          title={
            hasVideo
              ? undefined
              : 'Video belum tersedia'
          }
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand shadow-2xl transition-transform enabled:hover:scale-105 disabled:cursor-not-allowed"
        >
          {playing ? (
            <Pause size={34} fill="currentColor" />
          ) : (
            <Play size={34} fill="currentColor" />
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-[#000615] via-[#000615]/80 to-transparent p-4 text-white">
        <input
          type="range"
          aria-label="Posisi pemutaran video"
          min={0}
          max={Math.max(1, duration)}
          step={1}
          value={Math.min(position, Math.max(1, duration))}
          disabled={!hasVideo}
          onChange={(event) => seek(Number(event.target.value))}
          className="h-1.5 w-full cursor-pointer accent-[#aeceff] disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #aeceff ${percentage}%, rgba(255,255,255,.3) ${percentage}%)`,
          }}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={!hasVideo}
              onClick={() => void togglePlayback()}
              aria-label={playing ? 'Jeda' : 'Putar'}
              className="disabled:opacity-60"
            >
              {playing ? <Pause size={22} /> : <Play size={22} />}
            </button>

            <button
              type="button"
              disabled={!hasVideo}
              aria-label="Mundur 10 detik"
              onClick={() => seek(position - 10)}
              className="disabled:opacity-60"
            >
              <RotateCcw size={20} />
            </button>

            <button
              type="button"
              disabled={!hasVideo}
              aria-label="Maju 10 detik"
              onClick={() => seek(position + 10)}
              className="disabled:opacity-60"
            >
              <RotateCw size={20} />
            </button>

            <div className="hidden items-center gap-1.5 sm:flex">
              <Volume2 size={20} />

              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                disabled={!hasVideo}
                aria-label="Volume"
                onChange={(event) => {
                  const next = Number(event.target.value)
                  setVolume(next)
                  if (videoRef.current) videoRef.current.volume = next
                }}
                className="w-14 accent-white"
              />
            </div>

            <span className="font-mono text-[13px]">
              <strong>{formatTime(position)}</strong>
              <span className="text-white/70">
                {' '}/ {formatTime(duration)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onTakeNote(position)}
              className="hidden items-center gap-1 rounded bg-white/15 px-2.5 py-1 text-[11px] hover:bg-white/25 sm:inline-flex"
            >
              <StickyNote size={16} />
              Catat @{formatTime(position)}
            </button>

            <button
              type="button"
              disabled={!hasVideo}
              onClick={changeSpeed}
              className="rounded bg-white/15 px-2 py-0.5 text-[11px] disabled:opacity-60"
            >
              {speed}x
            </button>

            <button
              type="button"
              disabled={!hasVideo}
              onClick={() => void fullscreen()}
              aria-label="Layar penuh"
              className="disabled:opacity-60"
            >
              <Maximize size={22} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
