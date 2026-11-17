
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getLandingMaterials,
  type LandingMaterial,
} from "../../services/landingService";

type Level = "SD" | "SMP" | "SMA";

export default function LandingCatalog() {
  const [level, setLevel] = useState<Level>("SMA");
  const [materials, setMaterials] =
    useState<LandingMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getLandingMaterials()
      .then((data) => {
        if (active) setMaterials(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat materi"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = materials
    .filter((material) => material.educationLevel === level)
    .slice(0, 4);

  return (
    <section id="katalog" className="bg-[#f2f4f6] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase text-blue-700">
              Katalog Terpadu
            </span>

            <h2 className="mt-6 text-3xl font-extrabold text-[#0b1f3a] md:text-4xl">
              Temukan Materi Sesuai Kebutuhanmu
            </h2>

            <p className="mt-3 text-slate-600">
              Pilih jenjang sekolah dan temukan materi terbaik untukmu.
            </p>
          </div>

          <div className="flex self-start rounded-xl bg-white p-1 shadow-sm">
            {(["SD", "SMP", "SMA"] as Level[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                className={`rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                  level === item
                    ? "bg-[#40608b] text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading && (
            <p className="col-span-full py-10 text-center text-slate-500">
              Memuat materi pembelajaran...
            </p>
          )}

          {error && (
            <p role="alert" className="col-span-full py-10 text-center text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="col-span-full rounded-xl bg-white p-10 text-center text-slate-500">
              Belum ada materi untuk jenjang {level}.
            </p>
          )}

          {filtered.map((material) => (
            <Link
              key={material.id}
              to={`/materi/${material.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0b1f3a] to-[#40608b]">
                {material.imageUrl ? (
                  <img
                    src={material.imageUrl}
                    alt={material.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl text-white">
                    📚
                  </div>
                )}

                <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#0b1f3a]">
                  {material.educationLevel} · Kelas {material.grade}
                </div>

                <div className="absolute right-3 top-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  {material.accessTier}
                </div>
              </div>

              <div className="p-5">
                <span className="text-xs font-bold uppercase text-blue-700">
                  {material.category || "Materi Pembelajaran"}
                </span>

                <h3 className="mt-2 line-clamp-2 text-lg font-bold text-[#0b1f3a]">
                  {material.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {material.description}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4 text-sm font-bold text-blue-700">
                  Pelajari Materi →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/materi"
            className="inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0b1f3a] shadow-sm transition hover:bg-blue-50"
          >
            Lihat Semua Materi →
          </Link>
        </div>
      </div>
    </section>
  );
}
