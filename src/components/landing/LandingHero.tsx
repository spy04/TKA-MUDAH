
import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-[#f0f5fc] via-white to-white py-16 lg:py-24"
    >
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[700px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 text-center lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0b1f3a] shadow-sm">
          ✨ Platform Belajar Online untuk Generasi Hebat
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-[#0b1f3a] md:text-5xl lg:text-6xl">
          Belajar Lebih Mudah,
          <span className="mt-2 block text-[#40608b]">
            Raih Prestasi Lebih Tinggi.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">
          Pelajari materi sekolah, tonton video pembelajaran,
          kerjakan latihan soal, dan persiapkan ujian dalam satu
          platform belajar yang nyaman dan terarah.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="rounded-xl bg-[#40608b] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#0b1f3a]"
          >
            Mulai Belajar Gratis →
          </Link>

          <a
            href="#katalog"
            className="rounded-xl bg-white px-7 py-4 text-sm font-bold text-[#0b1f3a] shadow-sm transition hover:bg-slate-100"
          >
            Jelajahi Materi
          </a>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10">
            <div className="flex items-center justify-between bg-slate-100 px-5 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-slate-500">
                TKA Mudah Studio
              </span>
            </div>

            <div className="grid lg:grid-cols-3">
              <div className="relative flex min-h-72 flex-col justify-between bg-gradient-to-br from-[#061329] via-[#0b1f3a] to-[#40608b] p-6 text-white lg:col-span-2">
                <span className="self-start rounded-md bg-white/15 px-3 py-2 text-xs">
                  Fisika · Termodinamika
                </span>

                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl">
                    ▶
                  </div>
                  <h3 className="mt-5 text-xl font-bold">
                    Belajar Konsep Termodinamika
                  </h3>
                  <p className="mt-2 text-sm text-blue-100">
                    Video pembelajaran interaktif
                  </p>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-1/3 rounded-full bg-blue-300" />
                </div>
              </div>

              <div className="bg-white p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Ruang Belajar
                </span>

                <h3 className="mt-3 text-lg font-bold text-[#0b1f3a]">
                  Materi Terstruktur
                </h3>

                {[
                  "Konsep Dasar Termodinamika",
                  "Hukum Nol Termodinamika",
                  "Hukum I Termodinamika",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="mt-4 flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ))}

                <Link
                  to="/materi"
                  className="mt-6 inline-block text-sm font-bold text-blue-700"
                >
                  Jelajahi Materi →
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 -top-5 hidden rounded-xl bg-white p-4 text-left shadow-lg md:block">
            <div className="text-xs text-slate-500">Progres Belajar</div>
            <div className="mt-1 text-lg font-extrabold text-blue-700">
              Terus Berkembang
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
