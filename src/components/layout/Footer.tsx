
import {logo} from '../../assets'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stroke bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between lg:px-8">

        {/* Brand & Copyright */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo TKA Mudah"
              className="h-8 w-auto object-contain"
            />

            <span className="font-heading text-base font-semibold text-brand">
              TKA Mudah
            </span>
          </div>

          <p className="text-xs text-foreground-muted">
            © {new Date().getFullYear()} TKA Mudah. Hak cipta dilindungi.
          </p>
        </div>

        {/* Footer Links */}
        <nav aria-label="Navigasi footer">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="/bantuan"
              className="text-sm text-foreground-muted hover:text-brand"
            >
              Pusat Bantuan
            </a>

            <a
              href="/panduan"
              className="text-sm text-foreground-muted hover:text-brand"
            >
              Panduan Siswa
            </a>

            <a
              href="/privasi"
              className="text-sm text-foreground-muted hover:text-brand"
            >
              Kebijakan Privasi
            </a>
          </div>
        </nav>
      </div>
    </footer>
  )
}
