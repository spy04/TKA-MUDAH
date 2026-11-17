
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: "▶",
    title: "Video Pembelajaran",
    description: "Tonton penjelasan materi sesuai urutan bab.",
  },
  {
    icon: "☷",
    title: "Materi Terstruktur",
    description: "Pelajari konsep secara bertahap dan terarah.",
  },
  {
    icon: "▤",
    title: "Tujuan dan Rangkuman",
    description: "Pahami target belajar dan baca rangkuman konsep.",
  },
  {
    icon: "✓",
    title: "Pantau Penyelesaian",
    description: "Lanjutkan belajar dari progres sebelumnya.",
  },
];

export default function LandingLearning() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase text-blue-700">
            Ruang Belajar Modern
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#0b1f3a] md:text-4xl">
            Pengalaman Belajar yang Lebih Fokus dan Terarah
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Semua materi dirancang agar kamu lebih mudah memahami
            pelajaran, mengulang video, dan mengevaluasi perkembangan.
          </p>

          <div className="mt-8 space-y-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-700">
                  {benefit.icon}
                </div>

                <div>
                  <h3 className="font-bold text-[#0b1f3a]">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/materi"
            className="mt-9 inline-flex rounded-xl bg-[#40608b] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#0b1f3a]"
          >
            Mulai Jelajahi Materi →
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
          <div className="flex items-center justify-between bg-slate-100 px-5 py-4">
            <span className="text-sm font-semibold text-[#0b1f3a]">
              Ruang Belajar TKA Mudah
            </span>
            <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              Preview
            </span>
          </div>

          <div className="p-5">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#08172b] to-[#40608b]">
              <div className="text-center text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
                  ▶
                </div>
                <p className="mt-4 font-semibold">
                  Video Pembelajaran
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl">◎</div>
                <h4 className="mt-3 font-bold text-[#0b1f3a]">
                  Tujuan Pembelajaran
                </h4>
                <p className="mt-2 text-xs leading-6 text-slate-600">
                  Pelajari kompetensi dan konsep utama.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <div className="text-2xl">▤</div>
                <h4 className="mt-3 font-bold text-[#0b1f3a]">
                  Rangkuman Materi
                </h4>
                <p className="mt-2 text-xs leading-6 text-slate-600">
                  Baca kembali inti materi dengan mudah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
