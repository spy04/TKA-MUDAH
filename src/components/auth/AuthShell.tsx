import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { logo } from '../../assets'

type AuthShellProps = {
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

export default function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-page lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(440px,0.82fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-brand px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -left-28 top-1/4 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -left-12 top-[30%] h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 right-[-4rem] h-96 w-96 rounded-full bg-white/[0.04]" />

        <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3">
          <img src={logo} alt="TKA Mudah" className="h-10 w-auto object-contain brightness-0 invert" />
          <span className="font-heading text-xl font-extrabold tracking-tight">
            TKA Mudah
          </span>
        </Link>

        <div className="relative z-10 max-w-xl py-12">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-blue-100">
            <Sparkles size={14} />
            BELAJAR LEBIH TERARAH
          </span>
          <h1 className="font-heading text-4xl font-extrabold leading-tight xl:text-5xl">
            Temukan cara belajar yang{' '}
            <span className="text-blue-200">lebih bermakna.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-blue-100/85">
            Semua kebutuhan belajarmu dalam satu platform.
            Akses materi, kerjakan latihan, dan pantau progres belajar dengan lebih mudah.
          </p>

          {/* <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-blue-100">
                <GraduationCap size={21} />
              </span>
              <span className="text-sm font-semibold">Belajar sesuai jenjang</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-blue-100">
                <ShieldCheck size={20} />
              </span>
              <span className="text-sm font-semibold">Progres tersimpan aman</span>
            </div>
          </div> */}
        </div>

        <p className="relative z-10 text-xs text-blue-100/60">
          © {new Date().getFullYear()} TKA Mudah
        </p>
      </section>

      <section className="flex min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <img src={logo} alt="" className="h-9 w-auto object-contain" />
          <span className="font-heading text-lg font-extrabold text-brand">
            TKA Mudah
          </span>
        </div>
        <div className="w-full max-w-[480px] rounded-2xl border border-stroke bg-card p-6 shadow-[0_16px_50px_rgba(11,31,58,0.08)] sm:p-9">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-secondary">
              Ruang belajar TKA Mudah
            </p>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-brand sm:text-[28px]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              {description}
            </p>
          </div>
          {children}
          <div className="mt-6 border-t border-stroke pt-5 text-center text-sm text-foreground-muted">
            {footer}
          </div>
        </div>
        <p className="mt-5 max-w-md text-center text-[11px] leading-5 text-foreground-light">
          Dengan melanjutkan, kamu menyetujui ketentuan penggunaan dan kebijakan
          privasi TKA Mudah.
        </p>
      </section>
    </main>
  )
}

