
const features = [
  {
    icon: "▶",
    title: "Video Pembelajaran Interaktif",
    description:
      "Pelajari konsep melalui video dan penjelasan yang mudah dipahami.",
  },
  {
    icon: "✎",
    title: "Latihan Soal & Pembahasan",
    description:
      "Uji pemahamanmu dengan latihan soal dan penjelasan jawaban.",
  },
  {
    icon: "◷",
    title: "Simulasi Ujian CBT",
    description:
      "Latih manajemen waktu melalui simulasi ujian berbasis komputer.",
  },
  {
    icon: "↗",
    title: "Pantau Progres Belajar",
    description:
      "Lihat perkembangan belajarmu dan evaluasi hasil latihan.",
  },
];

export default function LandingFeatures() {
  return (
    <section id="keunggulan" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            Keunggulan Utama
          </span>

          <h2 className="mt-6 text-3xl font-extrabold text-[#0b1f3a] md:text-4xl">
            Semua yang Kamu Butuhkan untuk Belajar Lebih Baik
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Belajar lebih terstruktur, fleksibel, dan sesuai kebutuhanmu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl font-bold text-blue-700">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#0b1f3a]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
