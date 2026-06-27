import Link from "next/link";
import { Layers3 } from "lucide-react";

import { ExerciseCard } from "@/components/exercise-category-browser";
import { PublicContentLayout } from "@/components/layouts/public-content-layout";
import { buildHeaderMenus } from "@/components/student-dashboard/data";
import type { PublicTopicExerciseCollection } from "@/lib/public-content";

type PublicTopicExerciseViewProps = {
  topic: PublicTopicExerciseCollection;
};

export function PublicTopicExerciseView({ topic }: PublicTopicExerciseViewProps) {
  return (
    <PublicContentLayout homeHref="/" menus={buildHeaderMenus("/", "exercises")}>
      <section className="rounded-[24px] border border-[#d8e2f3] bg-white px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
        <Link href={`/topik/${topic.slug}`} className="text-[14px] font-bold text-[#2563eb]">
          Kembali ke detail topik
        </Link>

        <div className="mt-6 rounded-[22px] border border-[#d8e2f3] bg-[#f8fbff] p-5 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-[760px]">
              <div className="flex items-center gap-2 text-[#2563eb]">
                <Layers3 className="size-5" />
                <p className="text-[13px] font-bold uppercase tracking-[0.18em]">Latihan Topik</p>
              </div>
              <h1 className="mt-3 text-[30px] font-black tracking-tight text-[#1f2f46] sm:text-[36px]">
                {topic.title}
              </h1>
              <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                {topic.summary?.trim() ||
                  "Semua latihan yang sudah dipublish admin untuk topik ini ditampilkan di satu halaman khusus."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryCard label="Kategori" value={topic.category} />
              <SummaryCard label="Total latihan" value={`${topic.exerciseCount}`} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          {topic.exercises.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {topic.exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} mode="public" />
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-6 py-8 text-[15px] leading-8 text-[#596983]">
              Belum ada latihan yang siap dibuka untuk topik ini.
            </div>
          )}
        </div>
      </section>
    </PublicContentLayout>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[#e3eaf6] bg-white px-4 py-4">
      <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">{label}</p>
      <p className="mt-2 text-[24px] font-black text-[#1f2f46]">{value}</p>
    </div>
  );
}
