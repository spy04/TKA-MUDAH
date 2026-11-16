import { apiDelete, apiGet, apiPost, apiPut } from '../api/client'
import type {
  LearningMaterial,
  LearningNote as ApiLearningNote,
  LearningProgress,
} from '../api/contracts'

export type WorkspaceLesson = {
  id: string
  lessonId: string
  title: string
  duration: string
  status: 'completed' | 'current' | 'available'
}

export type WorkspaceChapter = {
  id: number
  title: string
  status: 'completed' | 'active' | 'available'
  lessons: WorkspaceLesson[]
}

export type LearningNote = {
  id: string
  timestamp: number
  text: string
  createdAt: string
}

export type RuangBelajarData = {
  id: string
  slug: string
  lessonId: string
  subject: string
  chapter: string
  lessonTitle: string
  lessonLabel: string
  courseLabel: string
  progress: number
  completedLessons: number
  totalLessons: number
  posterUrl: string
  videoUrl: string | null
  initialPosition: number
  duration: number
  currentCompleted: boolean
  objective: string
  summary: string
  chapters: WorkspaceChapter[]
  initialNotes: LearningNote[]
}

function formatDuration(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  return `${minutes}m`
}

function flattenLessons(material: LearningMaterial) {
  return material.chapters.flatMap((chapter) =>
    chapter.lessons.map((lesson) => ({ chapter, lesson }))
  )
}

function mapNote(note: ApiLearningNote): LearningNote {
  return {
    id: note.id,
    timestamp: note.timestamp,
    text: note.text,
    createdAt: note.createdAt,
  }
}

export async function getRuangBelajar(
  slug: string,
  requestedLessonId?: string
): Promise<RuangBelajarData | null> {
  const material = await apiGet<LearningMaterial>(
    `/me/learning/materials/${encodeURIComponent(slug)}`
  )
  const lessons = flattenLessons(material)
  const selected =
    lessons.find(({ lesson }) => lesson.id === requestedLessonId) ??
    lessons.find(({ lesson }) => !lesson.completed) ??
    lessons[0]
  if (!selected) return null

  const noteResponse = await apiGet<{ notes: ApiLearningNote[] }>(
    `/me/lessons/${encodeURIComponent(selected.lesson.id)}/notes`
  )
  const { chapter, lesson } = selected
  return {
    id: material.id,
    slug: material.slug,
    lessonId: lesson.id,
    subject: material.subject,
    chapter: `Bab ${chapter.position}: ${chapter.title}`,
    lessonTitle: lesson.title,
    lessonLabel: `${lesson.code ? `${lesson.code} • ` : ''}${lesson.title}`,
    courseLabel: `${material.subject} ${material.educationLevel} Kelas ${material.grade} • ${material.title}`,
    progress: material.progress,
    completedLessons: material.completedLessons,
    totalLessons: material.totalLessons,
    posterUrl: lesson.posterUrl ?? material.imageUrl ?? '',
    videoUrl: lesson.videoUrl,
    initialPosition: lesson.lastPositionSeconds,
    duration: lesson.durationSeconds,
    currentCompleted: lesson.completed,
    objective: lesson.objective ?? '',
    summary: lesson.summary ?? '',
    chapters: material.chapters.map((item) => {
      const chapterLessons = item.lessons.map((chapterLesson) => ({
        id: chapterLesson.code || String(chapterLesson.position),
        lessonId: chapterLesson.id,
        title: chapterLesson.title,
        duration: formatDuration(chapterLesson.durationSeconds),
        status:
          chapterLesson.id === lesson.id
            ? 'current'
            : chapterLesson.completed
              ? 'completed'
              : 'available',
      })) satisfies WorkspaceLesson[]
      const isActive = item.lessons.some(
        (chapterLesson) => chapterLesson.id === lesson.id
      )
      return {
        id: item.position,
        title: item.title,
        status: isActive
          ? 'active'
          : item.lessons.length > 0 &&
              item.lessons.every((chapterLesson) => chapterLesson.completed)
            ? 'completed'
            : 'available',
        lessons: chapterLessons,
      } satisfies WorkspaceChapter
    }),
    initialNotes: noteResponse.notes.map(mapNote),
  }
}

export async function saveLessonProgress(
  lessonId: string,
  lastPositionSeconds: number,
  completed = false
): Promise<LearningProgress> {
  return apiPut<LearningProgress>(
    `/me/lessons/${encodeURIComponent(lessonId)}/progress`,
    { lastPositionSeconds: Math.max(0, Math.floor(lastPositionSeconds)), completed }
  )
}

export async function createLessonNote(
  lessonId: string,
  timestamp: number,
  text: string
): Promise<LearningNote> {
  const note = await apiPost<ApiLearningNote>(
    `/me/lessons/${encodeURIComponent(lessonId)}/notes`,
    { timestamp: Math.max(0, Math.floor(timestamp)), text }
  )
  return mapNote(note)
}

export async function deleteLessonNote(
  lessonId: string,
  noteId: string
): Promise<void> {
  await apiDelete(
    `/me/lessons/${encodeURIComponent(lessonId)}/notes/${encodeURIComponent(noteId)}`
  )
}

