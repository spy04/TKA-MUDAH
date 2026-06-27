import Link from "next/link";

import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import { ExercisePlayerClient } from "@/components/exercise-player-client";
import { buildSidebarMenus } from "@/components/student-dashboard/data";
import type { StudentExerciseAttemptResult } from "@/lib/exercise-attempts";
import { buildExerciseCategorySlug, type PublicExerciseDetail } from "@/lib/public-content";

type StudentExercisePageProps = {
  exercise: PublicExerciseDetail;
  displayName: string;
  latestAttempt: StudentExerciseAttemptResult | null;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentExercisePage({
  exercise,
  displayName,
  latestAttempt,
  logoutAction,
}: StudentExercisePageProps) {
  const exerciseCategorySlug = buildExerciseCategorySlug(exercise.topic.category, exercise.topic.difficulty);
  const totalQuestions = Math.max(exercise.questions.length, exercise.questionCount, 0);
  const totalPoints = exercise.questions.reduce((sum, question) => sum + question.points, 0);

  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={buildSidebarMenus("/siswa", "exercises")}
      logoutAction={logoutAction}
      helperText="Siap lanjut latihan hari ini?"
      showPremiumCard={false}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <div className="flex flex-wrap items-center gap-3 text-[14px] font-bold">
          <Link href={`/siswa/latihan/kategori/${exerciseCategorySlug}`} className="text-[#2563eb]">
            Kembali ke {exercise.topic.category} - {exercise.topic.difficulty}
          </Link>
          <span className="text-[#b7c2d6]">/</span>
          <Link href={`/siswa/topik/${exercise.topic.slug}`} className="text-[#7b8aa3]">
            Lihat topik {exercise.topic.title}
          </Link>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-bold tracking-[0.12em] uppercase text-[#73829b]">Latihan Siswa</p>
              <h1 className="mt-2 text-[32px] font-black tracking-tight text-[#1f2f46] lg:text-[40px]">
                {exercise.title}
              </h1>
              <p className="mt-3 text-[15px] leading-7 text-[#596983]">
                {exercise.scope === "CATEGORY"
                  ? `Kategori ${exercise.topic.category} • ${exercise.topic.difficulty}`
                  : `Topik ${exercise.topic.category} • ${exercise.topic.title}`}
                {exercise.material?.title ? ` • terkait materi ${exercise.material.title}` : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-[18px] border border-[#dce5f4] bg-white px-4 py-3 text-right shadow-[0_12px_18px_-20px_rgba(15,23,42,0.35)]">
                <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#73829b]">Total Soal</p>
                <p className="mt-1 text-[22px] font-black text-[#2563eb]">{totalQuestions}</p>
              </div>
              <div className="rounded-[18px] border border-[#dce5f4] bg-white px-4 py-3 text-right shadow-[0_12px_18px_-20px_rgba(15,23,42,0.35)]">
                <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#73829b]">Total Poin</p>
                <p className="mt-1 text-[22px] font-black text-[#0f8a63]">{totalPoints}</p>
              </div>
            </div>
          </div>

          {exercise.adminNotes?.trim() ? (
            <div className="mt-5 rounded-[18px] border border-[#dce5f4] bg-white px-4 py-4 text-[14px] leading-7 text-[#596983]">
              <p className="text-[14px] font-bold text-[#1f2f46]">Petunjuk dari admin</p>
              <p className="mt-1">{exercise.adminNotes}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          <ExercisePlayerClient exercise={exercise} initialAttempt={latestAttempt} />
        </div>
      </section>
    </StudentAppLayout>
  );
}
