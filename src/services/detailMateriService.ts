import { apiGet } from '../api/client'
import type { MaterialDetail } from '../api/contracts'

export type MateriLesson = {
  id: string
  lessonId: string
  title: string
  description: string
  durationMinutes: number
  type: 'video' | 'reading' | 'quiz'
  access: 'open' | 'available'
  action: string
  path: string
}

export type MateriChapter = {
  id: number
  title: string
  durationLabel: string
  badge: string
  lessons: MateriLesson[]
}

export type DetailMateriData = {
  slug: string
  subject: string
  shortTitle: string
  title: string
  description: string
  level: string
  curriculum: string
  category: string
  imageUrl: string
  preview: {
    available: boolean
    videoUrl: string | null
  }
  outcomes: {
    title: string
    description: string
  }[]
  chapters: MateriChapter[]
  access: {
    free: boolean
    description: string
    facilities: string[]
  }
  instructor: {
    name: string
    role: string
    description: string
    imageUrl: string
    expertise: string
  } | null
}

function lessonType(contentType: string): MateriLesson['type'] {
  const normalized = contentType.toLowerCase()
  if (normalized.includes('quiz') || normalized.includes('assessment')) {
    return 'quiz'
  }
  if (normalized.includes('video')) return 'video'
  return 'reading'
}

export async function getDetailMateri(slug: string): Promise<DetailMateriData> {
  const item = await apiGet<MaterialDetail>(
    `/materials/${encodeURIComponent(slug)}`
  )

  const chapters = item.chapters.map((chapter) => {
    const lessons = chapter.lessons.map((lesson) => {
      const type = lessonType(lesson.contentType)
      const description =
        lesson.description ||
        (type === 'video' ? 'Video' : type === 'quiz' ? 'Latihan' : 'Bacaan')
      return {
        id: lesson.code || String(lesson.position),
        lessonId: lesson.id,
        title: lesson.title,
        description,
        durationMinutes: Math.ceil(lesson.durationSeconds / 60),
        type,
        access: 'open' as const,
        action: type === 'video' ? 'Putar' : type === 'quiz' ? 'Mulai' : 'Buka',
        path: `/belajar/${encodeURIComponent(slug)}?lessonId=${encodeURIComponent(lesson.id)}`,
      }
    })
    const seconds = chapter.lessons.reduce(
      (total, lesson) => total + lesson.durationSeconds,
      0
    )
    const minutes = Math.ceil(seconds / 60)
    return {
      id: chapter.position,
      title: chapter.title,
      durationLabel: `${minutes} menit`,
      badge: `${lessons.length} pelajaran`,
      lessons,
    }
  })

  const accessFree = item.accessTier === 'FREE'
  return {
    slug: item.slug,
    subject: item.subject.name,
    shortTitle: item.title,
    title: item.title,
    description: item.description ?? '',
    level: `${item.educationLevel} • Kelas ${item.grade}`,
    curriculum: item.curriculum ?? '',
    category: item.category || item.subject.name,
    imageUrl: item.imageUrl ?? '',
    preview: {
      available: false,
      videoUrl: null,
    },
    outcomes: item.outcomes.map((outcome) => ({
      title: outcome.title,
      description: outcome.description ?? '',
    })),
    chapters,
    access: {
      free: accessFree,
      description: accessFree
        ? 'Materi ini tersedia untuk dipelajari.'
        : 'Akses materi premium mengikuti grant aktif pada akun siswa.',
      facilities: [],
    },
    instructor: item.instructor
      ? {
          name: item.instructor.name,
          role: item.instructor.role ?? '',
          description: item.instructor.description ?? '',
          imageUrl: item.instructor.imageUrl ?? '',
          expertise: item.instructor.expertise ?? '',
        }
      : null,
  }
}

