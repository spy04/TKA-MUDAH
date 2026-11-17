import { apiGet, apiPost, setAccessToken } from '../api/client'
import type { ApiUser, AuthResult } from '../api/contracts'

export type RegisterRequest = {
  displayName: string
  email: string
  password: string
  educationLevel: 'SD' | 'SMP' | 'SMA'
  grade: number
}

export async function login(
  email: string,
  password: string
): Promise<ApiUser> {
  const result = await apiPost<AuthResult>(
    '/auth/login',
    { email, password }
  )
  setAccessToken(result.accessToken)
  return result.user ?? apiGet<ApiUser>('/me')
}

export async function register(
  input: RegisterRequest
): Promise<ApiUser> {
  const result = await apiPost<AuthResult>(
    '/auth/register',
    input
  )
  setAccessToken(result.accessToken)
  return result.user ?? apiGet<ApiUser>('/me')
}

