export type ApiUser = {
  id: string
  email: string
  role: 'STUDENT' | 'ADMIN'
  status: string
  createdAt: string
  profile: {
    displayName: string
    educationLevel: 'SD' | 'SMP' | 'SMA'
    grade: number
    school: string | null
    curriculum: string | null
  } | null
}

export type AuthResult = {
  user?: ApiUser
  accessToken: string
  tokenType: string
  expiresIn: number
}

export type CatalogMaterial = {
  id: string
  slug: string
  title: string
  description: string | null
  subject: { id: string; slug: string; name: string }
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
  curriculum: string | null
  category: string | null
  accessTier: 'FREE' | 'PREMIUM'
  priceAmount: number | null
  currency: string
  imageUrl: string | null
  lessonCount: number
  exerciseCount: number
  learnerCount: number
  publishedAt: string | null
}

export type MaterialDetail = {
  id: string
  slug: string
  title: string
  description: string | null
  subject: { id: string; slug: string; name: string }
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
  curriculum: string | null
  category: string | null
  accessTier: 'FREE' | 'PREMIUM'
  priceAmount: number | null
  currency: string
  imageUrl: string | null
  publishedAt: string | null
  instructor: {
    id: string
    name: string
    role: string | null
    description: string | null
    imageUrl: string | null
    expertise: string | null
  } | null
  outcomes: {
    id: string
    position: number
    title: string
    description: string | null
  }[]
  chapters: {
    id: string
    position: number
    title: string
    description: string | null
    lessons: {
      id: string
      code: string
      position: number
      title: string
      description: string | null
      contentType: string
      durationSeconds: number
      videoUrl: string | null
      posterUrl: string | null
      objective: string | null
      summary: string | null
    }[]
  }[]
}

export type CatalogPackage = {
  id: string
  slug: string
  title: string
  description: string | null
  kind: 'PRACTICE' | 'SIMULATION'
  subject: { id: string; slug: string; name: string }
  material: { id: string; slug: string; title: string } | null
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
  accessTier: 'FREE' | 'PREMIUM'
  priceAmount: number | null
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  durationSeconds: number
  questionCount: number
  publishedAt: string | null
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: { page: number; pageSize: number; total: number }
}

export type MaterialCatalogResponse = PaginatedResponse<CatalogMaterial> & {
  filters: {
    educationLevels: { value: string; label: string }[]
    accessTiers: { value: string; label: string }[]
    sorts: { value: string; label: string }[]
    subjects: { id: string; slug: string; name: string }[]
  }
}

export type LearningOverview = {
  student: {
    id: string
    displayName: string
    educationLevel: 'SD' | 'SMP' | 'SMA'
    grade: number
    school: string | null
    curriculum: string | null
  }
  summary: {
    materials: number
    totalLessons: number
    completedLessons: number
    progress: number
  }
  materials: {
    id: string
    slug: string
    title: string
    subject: string
    educationLevel: 'SD' | 'SMP' | 'SMA'
    grade: number
    accessTier: 'FREE' | 'PREMIUM'
    totalLessons: number
    completedLessons: number
    progress: number
    lastActivity: string | null
  }[]
}

export type LearningMaterial = {
  id: string
  slug: string
  title: string
  subject: string
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
  accessTier: 'FREE' | 'PREMIUM'
  imageUrl: string | null
  totalLessons: number
  completedLessons: number
  progress: number
  chapters: {
    id: string
    position: number
    title: string
    description: string | null
    lessons: {
      id: string
      code: string
      position: number
      title: string
      description: string | null
      contentType: string
      durationSeconds: number
      videoUrl: string | null
      posterUrl: string | null
      objective: string | null
      summary: string | null
      lastPositionSeconds: number
      completed: boolean
      completedAt: string | null
      lastAccessedAt: string | null
    }[]
  }[]
}

export type LearningNote = {
  id: string
  timestamp: number
  text: string
  createdAt: string
}

export type LearningProgress = {
  lessonId: string
  lastPositionSeconds: number
  completed: boolean
  completedAt: string | null
  lastAccessedAt: string
}

export type AssessmentAttempt = {
  id: string
  resumed: boolean
  packageId: string
  packageSlug: string
  title: string
  kind: 'PRACTICE' | 'SIMULATION'
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
  subject: string
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED'
  startedAt: string
  deadlineAt: string
  remainingSeconds: number
  totalQuestions: number
  answeredCount: number
  flaggedCount: number
  unansweredCount: number
  questions: {
    id: string
    number: number
    points: number
    topic: string | null
    difficulty: string
    type: string
    prompt: AssessmentContent
    options: { value: string; label: AssessmentContent }[]
    selectedOptionKey: string | null
    flagged: boolean
  }[]
}

export type AssessmentContent =
  | string
  | Record<string, unknown>
  | unknown[]

export type AssessmentResult = {
  attemptId: string
  packageId: string
  packageSlug: string
  title: string
  kind: 'PRACTICE' | 'SIMULATION'
  status: 'SUBMITTED' | 'EXPIRED'
  finishReason: 'MANUAL' | 'DEADLINE' | null
  startedAt: string
  submittedAt: string | null
  durationSeconds: number
  score: number
  earnedPoints: number
  totalPoints: number
  totalQuestions: number
  answeredCount: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
  passed: boolean | null
  questions: {
    id: string
    number: number
    points: number
    topic: string | null
    difficulty: string
    status: 'correct' | 'wrong' | 'unanswered'
    prompt: AssessmentContent
    selectedAnswer: { value: string; label: AssessmentContent } | null
    correctAnswer: { value: string; label: AssessmentContent }
    explanation: string | null
  }[]
}

export type AttemptHistoryItem = {
  id: string
  packageId: string
  packageSlug: string
  title: string
  kind: 'PRACTICE' | 'SIMULATION'
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED'
  startedAt: string
  deadlineAt: string
  submittedAt: string | null
  durationSeconds: number | null
  score: number | null
  answeredCount: number
  correctCount: number
  wrongCount: number
  unansweredCount: number
}

