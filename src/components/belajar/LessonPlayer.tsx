import { useCallback, useEffect, useRef, useState } from 'react'
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
  data: Pick<
    RuangBelajarData,
    | 'lessonId'
    | 'lessonTitle'
    | 'lessonLabel'
    | 'courseLabel'
    | 'posterUrl'
    | 'videoUrl'
    | 'initialPosition'
    | 'duration'
  >
  preview?: boolean
  onTakeNote?: (seconds: number) => void
  onPositionChange: (seconds: number, force?: boolean) => void
}

type VideoSource =
  | { kind: 'none' }
  | { kind: 'youtube'; videoId: string }
  | { kind: 'file'; url: string }
  | { kind: 'invalid' }

type YouTubePlayer = {
  destroy: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getIframe: () => HTMLIFrameElement
  pauseVideo: () => void
  playVideo: () => void
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void
  setPlaybackRate: (rate: number) => void
  setVolume: (volume: number) => void
}

type YouTubeApi = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      width: string
      height: string
      playerVars: Record<string, string | number>
      events: {
        onReady: (event: { target: YouTubePlayer }) => void
        onStateChange: (event: { data: number; target: YouTubePlayer }) => void
        onError: (event: { data: number }) => void
      }
    }
  ) => YouTubePlayer
  PlayerState: {
    ENDED: number
    PAUSED: number
    PLAYING: number
  }
}

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null

function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady
    let script: HTMLScriptElement | null = null
    const handleScriptError = () => {
      script?.removeEventListener('error', handleScriptError)
      if (window.onYouTubeIframeAPIReady === handleReady) {
        window.onYouTubeIframeAPIReady = previousCallback
      }
      youtubeApiPromise = null
      reject(new Error('YouTube Player API gagal dimuat.'))
    }
    const handleReady = () => {
      script?.removeEventListener('error', handleScriptError)
      if (window.onYouTubeIframeAPIReady === handleReady) {
        window.onYouTubeIframeAPIReady = previousCallback
      }
      previousCallback?.()
      if (window.YT?.Player) {
        resolve(window.YT)
      } else {
        youtubeApiPromise = null
        reject(new Error('YouTube Player API tidak tersedia.'))
      }
    }
    window.onYouTubeIframeAPIReady = handleReady

    script = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]'
    )
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener('error', handleScriptError, { once: true })
  })

  return youtubeApiPromise
}

function resolveVideoSource(videoUrl: string | null): VideoSource {
  if (!videoUrl) return { kind: 'none' }

  let url: URL
  try {
    url = new URL(videoUrl, window.location.origin)
  } catch {
    return { kind: 'invalid' }
  }

  const hostname = url.hostname.toLowerCase().replace(/^www\./, '')
  const isYouTube =
    hostname === 'youtu.be' ||
    hostname === 'youtube.com' ||
    hostname.endsWith('.youtube.com') ||
    hostname === 'youtube-nocookie.com' ||
    hostname.endsWith('.youtube-nocookie.com')

  if (isYouTube) {
    const path = url.pathname.split('/').filter(Boolean)
    const videoId =
      hostname === 'youtu.be'
        ? path[0]
        : url.pathname === '/watch'
          ? url.searchParams.get('v')
          : ['embed', 'shorts', 'live'].includes(path[0] ?? '')
            ? path[1]
            : null
    return videoId && /^[\w-]{11}$/.test(videoId)
      ? { kind: 'youtube', videoId }
      : { kind: 'invalid' }
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { kind: 'invalid' }
  }
  return { kind: 'file', url: videoUrl }
}

function validDuration(value: number) {
  return Number.isFinite(value) && value > 0
}

function formatTime(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safe / 60)
  const remaining = safe % 60

  return `${minutes}:${String(remaining).padStart(2, '0')}`
}

function youtubeErrorMessage(code: number) {
  if (code === 2) return 'Tautan YouTube tidak valid.'
  if (code === 5) return 'Video tidak dapat diputar di browser ini.'
  if (code === 100) return 'Video YouTube tidak tersedia atau telah dihapus.'
  if (code === 101 || code === 150) {
    return 'Pemilik video menonaktifkan pemutaran melalui embed.'
  }
  if (code === 153) return 'YouTube tidak dapat memverifikasi pemutar video ini.'
  return 'Video YouTube tidak dapat diputar.'
}

export default function LessonPlayer({
  data,
  preview = false,
  onTakeNote,
  onPositionChange,
}: LessonPlayerProps) {
  const source = resolveVideoSource(data.videoUrl)
  const sourceKind = source.kind
  const youtubeVideoId = source.kind === 'youtube' ? source.videoId : null
  const databaseDuration = validDuration(data.duration) ? data.duration : 0

  const rootRef = useRef<HTMLElement>(null)
  const youtubeMountRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null)
  const progressIntervalRef = useRef<number | null>(null)
  const metadataIntervalRef = useRef<number | null>(null)
  const positionRef = useRef(data.initialPosition)
  const previewFinishedRef = useRef(false)
  const onPositionChangeRef = useRef(onPositionChange)

  const [playing, setPlaying] = useState(false)
  const [playerReady, setPlayerReady] = useState(source.kind !== 'youtube')
  const [position, setPosition] = useState(data.initialPosition)
  const [actualDuration, setActualDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [speed, setSpeed] = useState(1.25)
  const [error, setError] = useState(
    source.kind === 'invalid'
      ? 'Tautan video tidak valid.'
      : source.kind === 'none'
        ? 'Video belum tersedia.'
        : ''
  )
  const [info, setInfo] = useState('')

  const duration = validDuration(actualDuration) ? actualDuration : databaseDuration
  const maxPlaybackPosition = preview ? duration * 0.2 : duration
  const sliderMax = Math.max(1, maxPlaybackPosition)
  const percentage = maxPlaybackPosition > 0
    ? Math.min(100, (position / maxPlaybackPosition) * 100)
    : 0
  const hasVideo = source.kind === 'youtube' || source.kind === 'file'
  const previewLimitRef = useRef(maxPlaybackPosition)
  const previewRef = useRef(preview)
  const actualDurationRef = useRef(actualDuration)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  useEffect(() => {
    onPositionChangeRef.current = onPositionChange
  }, [onPositionChange])
  useEffect(() => {
    previewLimitRef.current = maxPlaybackPosition
  }, [maxPlaybackPosition])
  useEffect(() => {
    previewRef.current = preview
  }, [preview])
  useEffect(() => {
    volumeRef.current = volume
  }, [volume])
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const updatePosition = useCallback((next: number, force = false) => {
    const safe = Math.max(0, Number.isFinite(next) ? next : 0)
    positionRef.current = safe
    setPosition(safe)
    onPositionChangeRef.current(safe, force)
  }, [])

  const stopAtPreviewLimit = useCallback((limit = previewLimitRef.current) => {
    if (!previewRef.current || !validDuration(limit)) return

    const safeLimit = Math.max(0, limit)
    const alreadyStopped =
      previewFinishedRef.current &&
      Math.abs(positionRef.current - safeLimit) < 0.25
    youtubePlayerRef.current?.pauseVideo()
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.seekTo(safeLimit, true)
    }
    const video = videoRef.current
    if (video) {
      video.pause()
      if (Math.abs(video.currentTime - safeLimit) >= 0.25) {
        video.currentTime = safeLimit
      }
    }
    setPlaying(false)
    if (alreadyStopped) return

    previewFinishedRef.current = true
    setInfo(`Pratinjau selesai pada ${formatTime(safeLimit)}.`)
    updatePosition(safeLimit, true)
  }, [updatePosition])

  const recordActualDuration = useCallback((value: number) => {
    if (!validDuration(value)) return
    if (Math.abs(actualDurationRef.current - value) < 0.25) return
    actualDurationRef.current = value
    const limit = previewRef.current ? value * 0.2 : value
    previewLimitRef.current = limit
    setActualDuration(value)
    setInfo((current) =>
      current.startsWith('Durasi video belum tersedia') ? '' : current
    )
    if (previewRef.current && positionRef.current > limit) {
      stopAtPreviewLimit(limit)
    }
  }, [stopAtPreviewLimit])

  useEffect(() => {
    function savePositionOnExit() {
      onPositionChangeRef.current(positionRef.current, true)
    }

    window.addEventListener('pagehide', savePositionOnExit)
    return () => window.removeEventListener('pagehide', savePositionOnExit)
  }, [data.lessonId])

  useEffect(() => {
    if (sourceKind === 'youtube' && youtubeVideoId) {
      let active = true
      let player: YouTubePlayer | null = null

      function stopPolling() {
        if (progressIntervalRef.current !== null) {
          window.clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }

      function readPlayerPosition() {
        if (!player) return
        recordActualDuration(player.getDuration())
        const next = player.getCurrentTime()
        const limit = previewLimitRef.current
        if (previewRef.current && validDuration(limit) && next >= limit) {
          stopAtPreviewLimit(limit)
          return
        }
        updatePosition(next)
      }

      function startPolling() {
        stopPolling()
        progressIntervalRef.current = window.setInterval(readPlayerPosition, 200)
      }

      loadYouTubeApi()
        .then((api) => {
          if (!active || !youtubeMountRef.current) return

          const mount = document.createElement('div')
          youtubeMountRef.current.appendChild(mount)
          player = new api.Player(mount, {
            videoId: youtubeVideoId,
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              playsinline: 1,
              rel: 0,
              origin: window.location.origin,
            },
            events: {
              onReady: (event) => {
                if (!active) {
                  event.target.destroy()
                  return
                }
                player = event.target
                youtubePlayerRef.current = event.target
                setPlayerReady(true)
                event.target.setVolume(Math.round(volumeRef.current * 100))
                event.target.setPlaybackRate(speedRef.current)
                recordActualDuration(event.target.getDuration())

                if (metadataIntervalRef.current !== null) {
                  window.clearInterval(metadataIntervalRef.current)
                }
                let metadataChecks = 0
                metadataIntervalRef.current = window.setInterval(() => {
                  metadataChecks += 1
                  recordActualDuration(event.target.getDuration())
                  if (actualDurationRef.current > 0 || metadataChecks >= 40) {
                    if (metadataIntervalRef.current !== null) {
                      window.clearInterval(metadataIntervalRef.current)
                      metadataIntervalRef.current = null
                    }
                  }
                }, 250)

                const limit = previewLimitRef.current
                if (previewRef.current && !validDuration(limit)) {
                  setInfo('Durasi video belum tersedia; pratinjau belum dapat diputar.')
                }
                const initial = Math.max(0, data.initialPosition)
                if (
                  previewRef.current &&
                  validDuration(limit) &&
                  initial >= limit
                ) {
                  event.target.seekTo(limit, true)
                  stopAtPreviewLimit(limit)
                } else if (initial > 0) {
                  event.target.seekTo(initial, true)
                  updatePosition(initial)
                }
              },
              onStateChange: (event) => {
                if (!active) return
                if (event.data === api.PlayerState.PLAYING) {
                  setPlaying(true)
                  startPolling()
                  readPlayerPosition()
                } else {
                  setPlaying(false)
                  stopPolling()
                  if (event.data === api.PlayerState.ENDED) {
                    recordActualDuration(event.target.getDuration())
                    const endedAt = event.target.getCurrentTime()
                    if (previewRef.current && endedAt >= previewLimitRef.current) {
                      stopAtPreviewLimit()
                    } else {
                      updatePosition(endedAt, true)
                    }
                  }
                }
              },
              onError: (event) => {
                if (!active) return
                setPlaying(false)
                stopPolling()
                setError(youtubeErrorMessage(event.data))
              },
            },
          })
          youtubePlayerRef.current = player
        })
        .catch(() => {
          if (active) {
            setError('Player YouTube gagal dimuat. Periksa koneksi lalu coba lagi.')
          }
        })

      return () => {
        active = false
        stopPolling()
        if (metadataIntervalRef.current !== null) {
          window.clearInterval(metadataIntervalRef.current)
          metadataIntervalRef.current = null
        }
        youtubePlayerRef.current = null
        player?.destroy()
      }
    }
  }, [
    data.initialPosition,
    sourceKind,
    youtubeVideoId,
    recordActualDuration,
    stopAtPreviewLimit,
    updatePosition,
  ])

  function seek(seconds: number) {
    if (preview && !validDuration(maxPlaybackPosition)) {
      setInfo('Durasi video belum tersedia; pratinjau belum dapat diputar.')
      return
    }

    const limit = preview ? maxPlaybackPosition : duration
    const target = Math.max(0, Math.min(validDuration(limit) ? limit : seconds, seconds))
    if (preview && seconds >= limit) {
      stopAtPreviewLimit(target)
      return
    }

    previewFinishedRef.current = false
    setInfo('')
    const player = youtubePlayerRef.current
    if (player) player.seekTo(target, true)
    if (videoRef.current) videoRef.current.currentTime = target
    updatePosition(target)
  }

  async function togglePlayback() {
    if (
      !hasVideo ||
      error ||
      (source.kind === 'youtube' && !playerReady)
    ) return

    if (playing) {
      youtubePlayerRef.current?.pauseVideo()
      videoRef.current?.pause()
      return
    }
    if (preview && !validDuration(maxPlaybackPosition)) {
      setInfo('Durasi video belum tersedia; pratinjau belum dapat diputar.')
      return
    }
    if (preview && positionRef.current >= maxPlaybackPosition) {
      stopAtPreviewLimit()
      return
    }

    previewFinishedRef.current = false
    setInfo('')
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.playVideo()
      return
    }
    const video = videoRef.current
    if (!video) return
    try {
      await video.play()
    } catch {
      setPlaying(false)
      setError('Video tidak dapat diputar. Coba tekan tombol putar lagi.')
    }
  }

  function changeSpeed() {
    const rates = [1, 1.25, 1.5, 2]
    const next = rates[(rates.indexOf(speed) + 1) % rates.length]
    setSpeed(next)
    youtubePlayerRef.current?.setPlaybackRate(next)
    if (videoRef.current) videoRef.current.playbackRate = next
  }

  function changeVolume(value: number) {
    setVolume(value)
    youtubePlayerRef.current?.setVolume(Math.round(value * 100))
    if (videoRef.current) videoRef.current.volume = value
  }

  async function fullscreen() {
    if (!hasVideo) return
    await rootRef.current?.requestFullscreen()
  }

  return (
    <section
      ref={rootRef}
      aria-label="Pemutar video pembelajaran"
      className="group relative aspect-video w-full select-none overflow-hidden rounded-xl bg-[#000615] shadow-xl [&:fullscreen]:aspect-auto [&:fullscreen]:h-screen [&:fullscreen]:w-screen [&:fullscreen]:rounded-none"
    >
      {source.kind === 'youtube' ? (
        <div
          ref={youtubeMountRef}
          className="absolute inset-0 [&_iframe]:h-full [&_iframe]:w-full"
        />
      ) : source.kind === 'file' ? (
        <video
          ref={videoRef}
          src={source.url}
          poster={data.posterUrl || undefined}
          preload="metadata"
          playsInline
          className="absolute inset-0 h-full w-full object-contain"
          onLoadedMetadata={(event) => {
            const video = event.currentTarget
            recordActualDuration(video.duration)
            video.volume = volume
            video.playbackRate = speed
            setPlayerReady(true)
            if (preview && validDuration(previewLimitRef.current) &&
              positionRef.current >= previewLimitRef.current) {
              video.currentTime = previewLimitRef.current
              stopAtPreviewLimit()
            } else if (positionRef.current > 0) {
              video.currentTime = positionRef.current
            }
          }}
          onTimeUpdate={(event) => {
            const next = event.currentTarget.currentTime
            const limit = previewLimitRef.current
            if (previewRef.current && validDuration(limit) && next >= limit) {
              stopAtPreviewLimit(limit)
              return
            }
            updatePosition(next)
          }}
          onSeeking={(event) => {
            const limit = previewLimitRef.current
            if (previewRef.current && validDuration(limit) &&
              event.currentTarget.currentTime > limit) {
              stopAtPreviewLimit(limit)
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={(event) => {
            setPlaying(false)
            updatePosition(event.currentTarget.currentTime, true)
          }}
          onError={() => setError('Video tidak tersedia atau formatnya tidak didukung.')}
        />
      ) : (
        <img
          src={data.posterUrl || undefined}
          alt={`Ilustrasi materi ${data.lessonTitle}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000615]/95 via-[#000615]/30 to-[#000615]/60" />

      <div className="pointer-events-none absolute left-4 right-4 top-4 z-20 flex flex-wrap items-start justify-between gap-2 text-white">
        <span className="inline-flex items-center gap-2 rounded-lg bg-[#000615]/80 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" />
          {data.lessonLabel}
        </span>
        <span className="rounded bg-white/15 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur-md">
          {data.courseLabel}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <button
          type="button"
          aria-label={playing ? 'Jeda video' : 'Putar video'}
          disabled={
            !hasVideo ||
            Boolean(error) ||
            (source.kind === 'youtube' && !playerReady) ||
            (preview && !validDuration(maxPlaybackPosition))
          }
          onClick={() => void togglePlayback()}
          title={!hasVideo ? 'Video belum tersedia' : undefined}
          className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-brand shadow-2xl transition-transform enabled:hover:scale-105 disabled:cursor-not-allowed"
        >
          {playing ? (
            <Pause size={34} fill="currentColor" />
          ) : (
            <Play size={34} fill="currentColor" />
          )}
        </button>
      </div>

      {(error || info) && (
        <div
          role={error ? 'alert' : 'status'}
          className="absolute bottom-24 left-1/2 z-30 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg bg-[#000615]/90 px-4 py-2 text-center text-sm text-white shadow-lg"
        >
          {error || info}
        </div>
      )}

      {preview && (
        <span className="pointer-events-none absolute bottom-[5.5rem] right-4 z-20 rounded bg-[#000615]/80 px-2 py-1 text-[11px] text-white">
          Preview 20%{validDuration(maxPlaybackPosition)
            ? ` • maks. ${formatTime(maxPlaybackPosition)}`
            : ''}
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col gap-2 bg-gradient-to-t from-[#000615] via-[#000615]/80 to-transparent p-4 text-white">
        <input
          type="range"
          aria-label="Posisi pemutaran video"
          min={0}
          max={sliderMax}
          step={1}
          value={Math.min(position, sliderMax)}
          disabled={!hasVideo || (preview && !validDuration(maxPlaybackPosition))}
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
              disabled={
                !hasVideo ||
                Boolean(error) ||
                (source.kind === 'youtube' && !playerReady) ||
                (preview && !validDuration(maxPlaybackPosition))
              }
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
                onChange={(event) => changeVolume(Number(event.target.value))}
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
            {onTakeNote && (
              <button
                type="button"
                onClick={() => onTakeNote(position)}
                className="hidden items-center gap-1 rounded bg-white/15 px-2.5 py-1 text-[11px] hover:bg-white/25 sm:inline-flex"
              >
                <StickyNote size={16} />
                Catat @{formatTime(position)}
              </button>
            )}

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
