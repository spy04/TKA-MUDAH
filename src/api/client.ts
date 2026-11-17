export type ApiErrorBody = {
  error?: {
    code?: string
    message?: string
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

type ApiEnvelope<T> = {
  data: T
}

type ApiRequestOptions = Omit<RequestInit, 'body' | 'headers' | 'credentials'> & {
  body?: unknown
  headers?: HeadersInit
}

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
).replace(/\/+$/, '')

let accessToken: string | null = null
const accessTokenStorageKey = 'binasiswa.accessToken'
const accessTokenListeners = new Set<(token: string | null) => void>()
const sessionExpiredListeners = new Set<() => void>()

export function setAccessToken(token: string | null) {
  accessToken = token
  if (token) {
    sessionStorage.setItem(accessTokenStorageKey, token)
  } else {
    sessionStorage.removeItem(accessTokenStorageKey)
  }
  accessTokenListeners.forEach((listener) => listener(token))
}

export function restoreStoredAccessToken(): string | null {
  const token = sessionStorage.getItem(accessTokenStorageKey)
  accessToken = token || null
  return accessToken
}

export function subscribeAccessToken(
  listener: (token: string | null) => void
) {
  accessTokenListeners.add(listener)
  return () => accessTokenListeners.delete(listener)
}

export function subscribeSessionExpired(listener: () => void) {
  sessionExpiredListeners.add(listener)
  return () => sessionExpiredListeners.delete(listener)
}

async function readError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody = {}
  try {
    body = (await response.json()) as ApiErrorBody
  } catch {
    // Error responses may have an empty or non-JSON body.
  }

  const defaults: Record<number, [string, string]> = {
    401: ['UNAUTHENTICATED', 'Sesi telah berakhir. Silakan masuk kembali.'],
    403: ['FORBIDDEN', 'Anda tidak memiliki akses untuk melakukan tindakan ini.'],
    404: ['NOT_FOUND', 'Data yang diminta tidak ditemukan.'],
    409: ['CONFLICT', 'Permintaan tidak dapat diproses karena konflik data.'],
    500: ['INTERNAL_ERROR', 'Terjadi kesalahan pada server. Coba lagi nanti.'],
  }
  const [defaultCode, defaultMessage] =
    defaults[response.status] ?? [
      'REQUEST_FAILED',
      'Permintaan tidak dapat diproses.',
    ]

  return new ApiError(
    response.status,
    body.error?.code || defaultCode,
    body.error?.message || defaultMessage
  )
}

async function request<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { body, headers: inputHeaders, ...requestOptions } = options
  const headers = new Headers(inputHeaders)
  headers.set('Accept', 'application/json')
  if (body !== undefined && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...requestOptions,
      headers,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'NETWORK_ERROR', 'Tidak dapat terhubung ke server.')
  }

  if (response.status === 401 && accessToken) {
    setAccessToken(null)
    sessionExpiredListeners.forEach((listener) => listener())
  }

  if (!response.ok) {
    throw await readError(response)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export async function apiGet<T>(path: string): Promise<T> {
  const envelope = await request<ApiEnvelope<T>>(path)
  return envelope.data
}

export async function apiPost<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const envelope = await request<ApiEnvelope<T>>(path, {
    method: 'POST',
    body,
  })
  return envelope.data
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const envelope = await request<ApiEnvelope<T>>(path, {
    method: 'PUT',
    body,
  })
  return envelope.data
}

export async function apiDelete(path: string): Promise<void> {
  await request<void>(path, { method: 'DELETE' })
}

export async function apiLogout(): Promise<void> {
  await request<void>('/auth/logout', { method: 'POST' })
}

