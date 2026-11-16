import { apiGet } from '../api/client'
import type { AssessmentResult } from '../api/contracts'
import {
  getAssessmentContentText,
  getAssessmentImage,
  normalizeAssessmentContent,
  type AssessmentImage,
} from './assessmentContent'

export type ReviewStatus = 'correct' | 'wrong' | 'unanswered'

export type ExplanationBlock = {
  type: 'paragraph' | 'formula' | 'data' | 'reflection' | 'conclusion'
  content: string
}

export type ReviewQuestion = {
  number: number
  topic: string
  difficulty: string
  status: ReviewStatus
  question: string
  image: AssessmentImage | null
  studentAnswer: string
  correctAnswer: string
  answerDescription: string
  keyDescription: string
  explanationTitle: string
  explanation: ExplanationBlock[]
}

export type HasilLatihanData = {
  sessionId: string
  packageId: string
  title: string
  subtitle: string
  score: number
  totalQuestions: number
  answered: number
  correct: number
  wrong: number
  unanswered: number
  durationSeconds: number
  allocatedMinutes: number | null
  passed: boolean | null
  reviews: ReviewQuestion[]
}

export async function getHasilLatihan(
  attemptId: string
): Promise<HasilLatihanData> {
  const result = await apiGet<AssessmentResult>(
    `/attempts/${encodeURIComponent(attemptId)}/result`
  )
  return {
    sessionId: result.attemptId,
    packageId: result.packageId,
    title: result.title,
    subtitle:
      result.kind === 'SIMULATION' ? 'Simulasi ujian' : 'Latihan soal',
    score: result.score,
    totalQuestions: result.totalQuestions,
    answered: result.answeredCount,
    correct: result.correctCount,
    wrong: result.wrongCount,
    unanswered: result.unansweredCount,
    durationSeconds: result.durationSeconds,
    allocatedMinutes: null,
    passed: result.passed,
    reviews: result.questions.map((question) => {
      const prompt = normalizeAssessmentContent(question.prompt)
      const studentAnswer = question.selectedAnswer
        ? getAssessmentContentText(
            normalizeAssessmentContent(question.selectedAnswer.label)
          )
        : 'Tidak dijawab'
      const correctAnswer = getAssessmentContentText(
        normalizeAssessmentContent(question.correctAnswer.label)
      )

      return {
        number: question.number,
        topic: question.topic ?? 'Topik tidak dicantumkan',
        difficulty: question.difficulty,
        status: question.status,
        question: getAssessmentContentText(prompt),
        image: getAssessmentImage(prompt),
        studentAnswer,
        correctAnswer,
        answerDescription:
          question.status === 'correct'
            ? 'Jawaban benar'
            : question.status === 'wrong'
              ? 'Jawaban belum tepat'
              : 'Tidak ada jawaban tersimpan',
        keyDescription: '',
        explanationTitle: 'Pembahasan',
        explanation: question.explanation
          ? [{ type: 'paragraph', content: question.explanation }]
          : [],
      }
    }),
  }
}

