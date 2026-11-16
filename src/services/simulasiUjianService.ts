import { apiGet, apiPost, apiPut } from '../api/client'
import type {
  AssessmentAttempt,
  AssessmentResult,
  CatalogPackage,
  PaginatedResponse,
} from '../api/contracts'
import type { AssessmentContent } from '../api/contracts'
import { normalizeAssessmentContent } from './assessmentContent'

export type AnswerOption = {
  value: string
  label: AssessmentContent
}

export type ExamQuestion = {
  id: string
  number: number
  subject: string
  points: number
  difficulty: string
  type: string
  prompt: AssessmentContent
  options: AnswerOption[]
}

export type ExamFormula = {
  title: string
  formula: string
  description: string
}

export type ExamData = {
  attemptId: string
  packageId: string
  status: AssessmentAttempt['status']
  title: string
  level: string
  subject: string
  deadlineAt: string
  totalQuestions: number
  initialSeconds: number
  currentQuestion: number
  questions: ExamQuestion[]
  initialAnswers: Record<number, string>
  initialFlagged: number[]
  formulas: ExamFormula[]
}

function mapAttempt(attempt: AssessmentAttempt): ExamData {
  const questions = attempt.questions.map((question, index) => ({
    id: question.id,
    number: index + 1,
    subject: question.topic ?? '',
    points: question.points,
    difficulty: question.difficulty,
    type: question.type,
    prompt: normalizeAssessmentContent(question.prompt),
    options: question.options.map((option) => ({
      ...option,
      label: normalizeAssessmentContent(option.label),
    })),
  }))
  const initialAnswers: Record<number, string> = {}
  const initialFlagged: number[] = []
  attempt.questions.forEach((question, index) => {
    const number = index + 1
    if (question.selectedOptionKey) {
      initialAnswers[number] = question.selectedOptionKey
    }
    if (question.flagged) initialFlagged.push(number)
  })

  const nextQuestion =
    attempt.questions.findIndex((question) => !question.selectedOptionKey) + 1
  return {
    attemptId: attempt.id,
    packageId: attempt.packageId,
    status: attempt.status,
    title: attempt.title,
    level: `${attempt.educationLevel} Kelas ${attempt.grade}`,
    subject: attempt.subject,
    deadlineAt: attempt.deadlineAt,
    totalQuestions: questions.length,
    initialSeconds: Math.max(0, attempt.remainingSeconds),
    currentQuestion: nextQuestion || 1,
    questions,
    initialAnswers,
    initialFlagged,
    formulas: [],
  }
}

export async function getSimulasiUjian(
  packageIdentifier: string
): Promise<ExamData> {
  const packageId = await resolvePackageId(packageIdentifier)
  const attempt = await apiPost<AssessmentAttempt>('/attempts', {
    packageId,
  })
  return mapAttempt(attempt)
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const packagePageSize = 100

async function resolvePackageId(identifier: string): Promise<string> {
  if (uuidPattern.test(identifier)) return identifier

  for (let page = 1; ; page += 1) {
    const catalog = await apiGet<PaginatedResponse<CatalogPackage>>(
      `/assessment-packages?page=${page}&pageSize=${packagePageSize}`
    )
    const match = catalog.items.find(
      (item) => item.slug === identifier && uuidPattern.test(item.id)
    )
    if (match) return match.id
    if (
      catalog.items.length === 0 ||
      page * catalog.pagination.pageSize >= catalog.pagination.total
    ) {
      break
    }
  }

  throw new Error('Paket latihan atau simulasi tidak ditemukan.')
}

export async function getAttemptById(attemptId: string): Promise<ExamData> {
  const attempt = await apiGet<AssessmentAttempt>(
    `/attempts/${encodeURIComponent(attemptId)}`
  )
  return mapAttempt(attempt)
}

export async function updateAttemptAnswer(
  attemptId: string,
  questionId: string,
  selectedOptionKey: string | null,
  flagged: boolean
): Promise<void> {
  await apiPut(
    `/attempts/${encodeURIComponent(attemptId)}/answers/${encodeURIComponent(questionId)}`,
    { selectedOptionKey: selectedOptionKey ?? '', flagged }
  )
}

export async function submitAttempt(
  attemptId: string
): Promise<AssessmentResult> {
  return apiPost<AssessmentResult>(
    `/attempts/${encodeURIComponent(attemptId)}/submit`
  )
}

