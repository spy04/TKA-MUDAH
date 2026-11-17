
import { useState } from "react";
import { Link } from "react-router-dom";
import { logo } from "../../assets";

const navigation = [
  { label: "Beranda", href: "#beranda" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "Jelajahi Materi", href: "#katalog" },
  { label: "Latihan Soal", href: "#latihan" },
  { label: "Tentang Kami", href: "#tentang" },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-5 px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo TKA Mudah"
            className="h-10 w-auto object-contain"
          />

          <div>
            <div className="text-lg font-bold tracking-tight text-[#0b1f3a]">
              TKA Mudah
            </div>
            {/* <div className="text-[10px] font-semibold text-blue-600">
              EdTech SD · SMP · SMA
            </div> */}
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-[#40608b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b1f3a]"
          >
            Daftar Gratis
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Buka menu"
          aria-expanded={open}
          className="rounded-lg border border-slate-200 p-2.5 lg:hidden"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-slate-700"
              >
                {item.label}
              </a>
            ))}

            <Link to="/login" className="text-sm font-semibold">
              Masuk
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-[#40608b] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Daftar Gratis
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
