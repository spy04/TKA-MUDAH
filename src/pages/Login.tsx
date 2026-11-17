import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { ApiError } from '../api/client'
import AuthShell from '../components/auth/AuthShell'
import Button from '../components/ui/Button'
import { useAuth } from '../auth/AuthProvider'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const notice = (location.state as { notice?: string } | null)?.notice
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname
      navigate(from || '/dashboard', { replace: true })
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'INVALID_CREDENTIALS') {
        setError('Email atau kata sandi tidak sesuai.')
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Gagal masuk. Silakan coba kembali.'
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Selamat datang di TKA Mudah"
      description=""
      footer={
        <>
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-brand hover:underline">
            Daftar sekarang
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {notice && (
          <p role="status" className="rounded-lg bg-amber-50 px-3.5 py-3 text-sm text-amber-800">
            {notice}
          </p>
        )}
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">
            Email
          </span>
          <span className="relative block">
            <Mail
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-light"
            />
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-stroke bg-white py-3 pl-11 pr-3 text-sm text-foreground outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-foreground">
            Kata sandi
          </span>
          <span className="relative block">
            <LockKeyhole
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-light"
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              maxLength={1024}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full rounded-lg border border-stroke bg-white py-3 pl-11 pr-12 text-sm text-foreground outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-foreground-light hover:bg-muted"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full justify-center py-3">
          {submitting ? 'Memeriksa akun...' : 'Masuk'}
        </Button>
      </form>
    </AuthShell>
  )
}

