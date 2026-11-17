
import { Link } from "react-router-dom";

const options = [
  "200 J",
  "300 J",
  "500 J",
  "700 J",
];

export default function LandingExam() {
  return (
    <section id="latihan" className="bg-[#f2f4f6] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase text-blue-700">
            Simulasi Ujian CBT
          </span>

          <h2 className="mt-6 text-3xl font-extrabold text-[#0b1f3a] md:text-4xl">
            Lebih Siap Menghadapi Setiap Ujian
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Latih pemahaman dan manajemen waktumu melalui latihan
            soal serta simulasi ujian.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between bg-[#0b1f3a] px-6 py-4 text-white">
              <span className="text-sm font-bold">
                Contoh Soal Fisika
              </span>
              <span className="rounded-lg bg-white/15 px-3 py-2 text-xs font-bold">
                SIMULASI CBT
              </span>
            </div>

            <div className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-[#0b1f3a]">
                Pertanyaan Contoh
              </h3>

              <p className="mt-4 leading-7 text-slate-700">
                Sebuah sistem menerima kalor sebesar 500 J
                dan melakukan usaha sebesar 200 J.
                Berapakah perubahan energi dalamnya?
              </p>

              <div className="mt-6 space-y-3">
                {options.map((option, index) => (
                  <div
                    key={option}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-700"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 font-bold text-[#0b1f3a]">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-500">
                Ilustrasi tampilan ujian. Untuk mengerjakan soal,
                buka halaman latihan.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-6 lg:border-l lg:border-t-0">
            <h3 className="font-bold text-[#0b1f3a]">
              Apa yang Bisa Kamu Lakukan?
            </h3>

            <div className="mt-6 space-y-4">
              {[
                "Kerjakan latihan soal",
                "Pantau waktu pengerjaan",
                "Tandai soal ragu-ragu",
                "Lihat hasil dan pembahasan",
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm text-slate-700">
                  <span className="font-bold text-green-600">✓</span>
                  {item}
                </div>
              ))}
            </div>

            <Link
              to="/latihan"
              className="mt-8 block rounded-xl bg-[#40608b] px-5 py-3.5 text-center text-sm font-bold text-white hover:bg-[#0b1f3a]"
            >
              Coba Latihan Soal →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
