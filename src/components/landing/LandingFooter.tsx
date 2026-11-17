
import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <>
      <section className="bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1f3a] to-[#40608b] px-6 py-16 text-center text-white md:px-12">
          <span className="text-sm font-semibold text-blue-200">
            Mulai Perjalanan Belajarmu
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight md:text-4xl">
            Masa Depan Hebat Dimulai dari Belajar Hari Ini.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Temukan materi pembelajaran dan tingkatkan kemampuanmu
            bersama TKA Mudah.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 text-sm font-bold text-[#0b1f3a] transition hover:bg-blue-50"
          >
            Daftar Gratis Sekarang →
          </Link>
        </div>
      </section>

      <footer id="tentang" className="bg-[#08172b] py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-3 lg:px-8">
          <div>
            <h3 className="text-xl font-extrabold">TKA Mudah</h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
              Platform belajar online yang membantu siswa
              memahami materi, berlatih soal, dan mempersiapkan ujian.
            </p>
          </div>

          <div>
            <h4 className="font-bold">Pembelajaran</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
              <Link to="/materi" className="hover:text-white">
                Jelajahi Materi
              </Link>
              <Link to="/latihan" className="hover:text-white">
                Latihan Soal
              </Link>
              <Link to="/ujian" className="hover:text-white">
                Simulasi Ujian
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold">Akun</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-300">
              <Link to="/login" className="hover:text-white">
                Masuk
              </Link>
              <Link to="/register" className="hover:text-white">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-5 pt-6 text-center text-xs text-slate-400 lg:px-8">
          © {new Date().getFullYear()} TKA Mudah.
          Semua hak dilindungi.
        </div>
      </footer>
    </>
  );
}
