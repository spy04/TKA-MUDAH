import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { apiGet, setAccessToken, subscribeSessionExpired } from '../api/client'
import { AuthProvider, useAuth } from './AuthProvider'
import { ProtectedRoute } from './RouteGuards'

const user = {
  id: 'student-1',
  displayName: 'Siswa',
  email: 'siswa@example.test',
  role: 'STUDENT' as const,
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function AuthState() {
  const { loading, user } = useAuth()
  return <p>{loading ? 'loading' : user?.email ?? 'anonymous'}</p>
}

function LogoutButton() {
  const { logout } = useAuth()
  return <button onClick={() => void logout()}>Keluar</button>
}

describe('JWT bearer-only authentication', () => {
  beforeEach(() => {
    sessionStorage.clear()
    setAccessToken(null)
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('logs in, stores only the access token for this tab, and uses Bearer', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json({ accessToken: 'login-token', user }))
    vi.stubGlobal('fetch', fetchMock)

    const { login } = await import('../services/authService')
    await expect(login(user.email, 'password-not-stored')).resolves.toEqual(user)

    expect(sessionStorage.getItem('binasiswa.accessToken')).toBe('login-token')
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(fetchMock.mock.calls[0][1].credentials).toBeUndefined()
    const headers = new Headers(fetchMock.mock.calls[0][1].headers)
    expect(headers.get('Authorization')).toBeNull()
  })

  it('restores a same-tab session after reload and validates it through /me', async () => {
    sessionStorage.setItem('binasiswa.accessToken', 'stored-token')
    const fetchMock = vi.fn().mockResolvedValue(json(user))
    vi.stubGlobal('fetch', fetchMock)

    render(<AuthProvider><AuthState /></AuthProvider>)

    await screen.findByText(user.email)
    const headers = new Headers(fetchMock.mock.calls[0][1].headers)
    expect(headers.get('Authorization')).toBe('Bearer stored-token')
  })

  it('clears an expired or invalid JWT after a 401 and does not refresh it', async () => {
    setAccessToken('expired-token')
    const expired = vi.fn()
    const unsubscribe = subscribeSessionExpired(expired)
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiGet('/me')).rejects.toMatchObject({ status: 401 })

    expect(sessionStorage.getItem('binasiswa.accessToken')).toBeNull()
    expect(expired).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).not.toContain('/auth/refresh')
    unsubscribe()
  })

  it('redirects an anonymous visitor away from a protected route', async () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<p>Login page</p>} />
            <Route path="/private" element={<ProtectedRoute><p>Private</p></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    )

    await screen.findByText('Login page')
  })

  it('logs out with the Bearer token, then removes the local session', async () => {
    setAccessToken('logout-token')
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(json(user))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    render(<AuthProvider><LogoutButton /></AuthProvider>)
    await screen.findByRole('button', { name: 'Keluar' })
    screen.getByRole('button', { name: 'Keluar' }).click()

    await waitFor(() => {
      expect(sessionStorage.getItem('binasiswa.accessToken')).toBeNull()
    })
    expect(fetchMock.mock.calls[1][0]).toContain('/auth/logout')
    const headers = new Headers(fetchMock.mock.calls[1][1].headers)
    expect(headers.get('Authorization')).toBe('Bearer logout-token')
  })
})
