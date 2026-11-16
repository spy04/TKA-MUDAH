import type { AssessmentContent } from '../api/contracts'

export type AssessmentImage = {
  url: string
  alt: string
}

function isContentObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function normalizeAssessmentContent(
  content: AssessmentContent
): AssessmentContent {
  if (typeof content !== 'string') return content

  try {
    const parsed: unknown = JSON.parse(content)
    if (
      typeof parsed === 'string' ||
      isContentObject(parsed) ||
      Array.isArray(parsed)
    ) {
      return parsed
    }
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
  }

  return content
}

export function getAssessmentContentText(
  content: AssessmentContent
): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return ''
  return typeof content.text === 'string' ? content.text : ''
}

function resolveImageUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const markdownLink = value.trim().match(/^\[[^\]]*\]\((https?:\/\/[^)\s]+)\)$/i)
  const candidate = markdownLink?.[1] ?? value.trim()

  try {
    const url = new URL(candidate)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : null
  } catch (error) {
    if (error instanceof TypeError) return null
    throw error
  }
}

export function getAssessmentImage(
  content: AssessmentContent
): AssessmentImage | null {
  if (typeof content === 'string' || Array.isArray(content)) return null

  const url = resolveImageUrl(content.imageUrl)
  if (!url) return null

  const alt =
    typeof content.imageAlt === 'string' && content.imageAlt.trim()
      ? content.imageAlt.trim()
      : getAssessmentContentText(content) || 'Ilustrasi soal'

  return { url, alt }
}
