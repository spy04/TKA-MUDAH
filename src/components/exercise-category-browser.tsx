import Link from "next/link";
import { BookOpenCheck, ClipboardCheck, Layers3, Lock, Shapes } from "lucide-react";

import type {
  PublicExerciseCategoryDetail,
  PublicExerciseCategorySummary,
  PublicTopicExercise,
} from "@/lib/public-content";
import { cn } from "@/lib/utils";

type BrowserMode = "public" | "student";

export function ExerciseCategoryGrid({
  categories,
  mode,
}: {
  categories: PublicExerciseCategorySummary[];
  mode: BrowserMode;
}) {
  return categories.length > 0 ? (
    <div className="grid gap-4 lg:grid-cols-2">
      {categories.map((category) => {
        const href =
          mode === "student"
            ? `/siswa/latihan/kategori/${category.slug}`
            : `/latihan/kategori/${category.slug}`;

        return (
          <article
            key={category.slug}
            className="rounded-[22px] border border-[#d8e2f3] bg-white p-5 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.35)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-12 items-center justify-center rounded-[14px] bg-[#eef4ff] text-[#2563eb]">
                <Shapes className="size-5" />
              </div>
              <span className="rounded-full bg-[#f8fbff] px-3 py-1 text-[11px] font-bold text-[#73829b]">
                {category.difficulty}
              </span>
            </div>

            <h2 className="mt-4 text-[24px] font-black tracking-tight text-[#1f2f46]">
              {category.category} - {category.difficulty}
            </h2>
            <p className="mt-2 text-[14px] leading-7 text-[#596983]">{category.exerciseCount} latihan kategori</p>

            <div className="mt-5 rounded-[16px] bg-[#f8fbff] px-4 py-3 text-[13px] leading-7 text-[#596983]">
              Halaman ini khusus menampilkan latihan kategori untuk kombinasi kategori dan jenjang tersebut.
            </div>

            <div className="mt-5">
              <Link
                href={href}
                className={cn(
                  "flex h-[44px] items-center justify-center rounded-[12px] text-[14px] font-bold text-white",
                  mode === "student" ? "bg-[#0f8a63]" : "bg-[#2563eb]",
                )}
              >
                {mode === "student" ? "Buka Kategori" : "Lihat Kategori"}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  ) : (
    <div className="rounded-[20px] border border-dashed border-[#d8e2f3] bg-white px-6 py-8 text-[15px] leading-8 text-[#596983]">
      Belum ada latihan kategori yang dipublish.
    </div>
  );
}

export function ExerciseCategoryTopics({
  detail,
  mode,
}: {
  detail: PublicExerciseCategoryDetail;
  mode: BrowserMode;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[24px] border border-[#d8e2f3] bg-white p-5 shadow-[0_16px_30px_-26px_rgba(15,23,42,0.35)] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#2563eb]">
              <Layers3 className="size-5" />
              <p className="text-[13px] font-bold uppercase tracking-[0.18em]">Kategori Latihan</p>
            </div>
            <h2 className="mt-3 text-[28px] font-black tracking-tight text-[#1f2f46]">
              {detail.category} - {detail.difficulty}
            </h2>
            <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#596983]">
              Semua latihan di halaman ini adalah paket kategori umum. Latihan yang terhubung ke topik dibuka dari
              halaman topiknya masing-masing.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryCard label="Kategori aktif" value={1} />
            <SummaryCard label="Total latihan" value={detail.exerciseCount} />
          </div>
        </div>
      </section>

      {detail.generalExercises.length > 0 ? (
        <section className="rounded-[22px] border border-[#d8e2f3] bg-white p-5 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.35)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#73829b]">Latihan Kategori</p>
              <h3 className="mt-2 text-[24px] font-black tracking-tight text-[#1f2f46]">
                Paket langsung untuk {detail.category} - {detail.difficulty}
              </h3>
              <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                {detail.generalExercises.length} latihan umum tersedia dan langsung berlaku untuk kategori ini.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {detail.generalExercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} mode={mode} />
            ))}
          </div>
        </section>
      ) : null}

      {detail.topics.length === 0 && detail.generalExercises.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-[#d8e2f3] bg-white px-6 py-8 text-[15px] leading-8 text-[#596983]">
          Belum ada latihan kategori yang siap ditampilkan.
        </div>
      ) : null}
    </div>
  );
}

export function ExerciseCard({
  exercise,
  mode,
}: {
  exercise: PublicTopicExercise;
  mode: BrowserMode;
}) {
  const isPreview = exercise.accessLevel === "PREVIEW";
  const href =
    mode === "student"
      ? `/siswa/latihan/${exercise.id}`
      : isPreview
        ? `/masuk?callbackUrl=${encodeURIComponent(`/siswa/latihan/${exercise.id}`)}`
        : "/daftar";
  const ctaLabel = mode === "student" ? "Buka Latihan" : isPreview ? "Masuk untuk Mulai" : "Daftar Premium";

  return (
    <article className="rounded-[20px] border border-[#e3eaf6] bg-[#fbfdff] p-5">
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-[14px]",
            isPreview ? "bg-[#eef4ff] text-[#2563eb]" : "bg-[#fff4e5] text-[#b7791f]",
          )}
        >
          {exercise.materialTitle ? <BookOpenCheck className="size-5" /> : <ClipboardCheck className="size-5" />}
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold",
            isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#fff4e5] text-[#b7791f]",
          )}
        >
          {isPreview ? "Preview" : mode === "student" ? "Enrolled" : "Premium"}
        </span>
      </div>

      <h4 className="mt-4 text-[20px] font-black text-[#1f2f46]">{exercise.title}</h4>
      <p className="mt-2 text-[14px] leading-7 text-[#596983]">
        {exercise.questionCount} soal
        {exercise.materialTitle
          ? ` • terkait materi ${exercise.materialTitle}`
          : exercise.scope === "CATEGORY"
            ? " • latihan kategori langsung"
            : " • latihan topik langsung"}
      </p>

      <div className="mt-5 flex items-center gap-2 rounded-[16px] bg-white px-4 py-3 text-[13px] font-medium text-[#596983]">
        <Lock className="size-4 shrink-0" />
        {isPreview
          ? mode === "student"
            ? "Bisa langsung dikerjakan dari akun siswa."
            : "Gratis dikerjakan, tetapi tetap perlu login agar progres tersimpan."
          : mode === "student"
            ? "Latihan ini tersedia untuk akun enrolled."
            : "Latihan ini tersedia untuk akun premium."}
      </div>

      <div className="mt-5">
        {mode === "student" || isPreview ? (
          <Link
            href={href}
            className={cn(
              "flex h-[44px] items-center justify-center rounded-[12px] text-[14px] font-bold text-white",
              mode === "student" ? "bg-[#0f8a63]" : "bg-[#2563eb]",
            )}
          >
            {ctaLabel}
          </Link>
        ) : (
          <Link
            href={href}
            className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#edf8f2] text-[14px] font-bold text-[#0f8a63]"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </article>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
      <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">{label}</p>
      <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{value}</p>
    </div>
  );
}
