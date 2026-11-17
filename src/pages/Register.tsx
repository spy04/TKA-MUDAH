import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { ApiError } from '../api/client'
import AuthShell from '../components/auth/AuthShell'
import Button from '../components/ui/Button'
import { useAuth } from '../auth/AuthProvider'

type EducationLevel = 'SD' | 'SMP' | 'SMA'

const gradeOptions: Record<EducationLevel, number[]> = {
  SD: [1, 2, 3, 4, 5, 6],
  SMP: [7, 8, 9],
  SMA: [10, 11, 12],
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('SMA')
  const [grade, setGrade] = useState(10)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleEducationChange(value: EducationLevel) {
    setEducationLevel(value)
    setGrade(gradeOptions[value][0])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi belum sama.')
      return
    }
    if (password.length < 12) {
      setError('Kata sandi harus terdiri dari minimal 12 karakter.')
      return
    }

    setSubmitting(true)
    try {
      await register({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        educationLevel,
        grade,
      })
      navigate('/dashboard', { replace: true })
    } catch (caught) {
      if (caught instanceof ApiError && caught.code === 'EMAIL_ALREADY_EXISTS') {
        setError('Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.')
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : 'Pendaftaran gagal. Silakan coba kembali.'
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Buat akun siswa"
      description=""
      footer={
        <>
          Sudah memiliki akun?{' '}
          <Link to="/login" className="font-bold text-brand hover:underline">
            Masuk
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
            Nama siswa
          </span>
          <span className="relative block">
            <UserRound
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-light"
            />
            <input
              type="text"
              name="displayName"
              autoComplete="name"
              required
              maxLength={120}
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Nama lengkap"
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-11 pr-3 text-sm outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
            />
          </span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-foreground">
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
              className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-11 pr-3 text-sm outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
            />
          </span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-foreground">
              Jenjang
            </span>
            <select
              value={educationLevel}
              onChange={(event) =>
                handleEducationChange(event.target.value as EducationLevel)
              }
              className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
            >
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA">SMA</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-foreground">
              Kelas
            </span>
            <select
              value={grade}
              onChange={(event) => setGrade(Number(event.target.value))}
              className="w-full rounded-lg border border-stroke bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
            >
              {gradeOptions[educationLevel].map((option) => (
                <option key={option} value={option}>
                  Kelas {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <PasswordField
          label="Kata sandi"
          value={password}
          onChange={setPassword}
          show={showPassword}
          onToggle={() => setShowPassword((visible) => !visible)}
          autoComplete="new-password"
        />
        <PasswordField
          label="Konfirmasi kata sandi"
          value={confirmPassword}
          onChange={setConfirmPassword}
          show={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((visible) => !visible)}
          autoComplete="new-password"
        />

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="w-full justify-center py-3">
          {submitting ? 'Membuat akun...' : 'Daftar dan mulai belajar'}
        </Button>
      </form>
    </AuthShell>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggle: () => void
  autoComplete: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
      </span>
      <span className="relative block">
        <LockKeyhole
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-light"
        />
        <input
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          minLength={12}
          maxLength={1024}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Minimal 12 karakter"
          className="w-full rounded-lg border border-stroke bg-white py-2.5 pl-11 pr-12 text-sm outline-none transition focus:border-brand-secondary focus:ring-4 focus:ring-blue-100"
        />
        <button
          type="button"
          aria-label={show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-foreground-light hover:bg-muted"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
  )
}

