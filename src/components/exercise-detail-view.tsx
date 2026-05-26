import Link from "next/link";

import { buildHeaderMenus, buildSidebarMenus } from "@/components/student-dashboard/data";
import { ExercisePlayerClient } from "@/components/exercise-player-client";
import { StudentFooter } from "@/components/student-dashboard/student-footer";
import { StudentNavbar } from "@/components/student-dashboard/student-navbar";
import { StudentSidebar } from "@/components/student-dashboard/student-sidebar";
import type { PublicExerciseDetail } from "@/lib/public-content";

type ExerciseDetailViewProps = {
  exercise: PublicExerciseDetail;
  displayName?: string;
  homeHref?: string;
  isEnrolled?: boolean;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function ExerciseDetailView({
  exercise,
  displayName = "Adik",
  homeHref = "/",
  isEnrolled = false,
  logoutAction,
}: ExerciseDetailViewProps) {
  const avatarText = displayName.charAt(0).toUpperCase();
  const exerciseHref = isEnrolled ? "/siswa/latihan" : "/latihan";
  const headerMenus = buildHeaderMenus(homeHref, "exercises", exerciseHref);
  const sidebarMenus = buildSidebarMenus(homeHref, "topics");
  const totalQuestions = Math.max(exercise.questions.length, exercise.questionCount, 0);

  return (
    <main className="min-h-screen bg-[#eaf1ff] text-[#1f2f46]">
      <StudentNavbar avatarText={avatarText} homeHref={homeHref} menus={headerMenus} />

      <div className="bg-[#f5f8ff]">
        <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 lg:px-6">
          <div className="hidden self-start pt-2 lg:sticky lg:top-[84px] lg:block">
            <StudentSidebar displayName={displayName} menus={sidebarMenus} logoutAction={logoutAction} />
          </div>

          <div className="min-w-0 flex-1">
            <section className="rounded-[24px] border border-[#d8e2f3] bg-[#f7f9ff] px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
              <Link
                href={isEnrolled ? `/siswa/topik/${exercise.topic.slug}` : `/topik/${exercise.topic.slug}`}
                className="text-[14px] font-bold text-[#2563eb]"
              >
                Kembali ke topik {exercise.topic.title}
              </Link>

              <div className="mt-4">
                <h1 className="text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">
                  Latihan Soal: {exercise.topic.category} - {exercise.topic.title}
                </h1>
                <p className="mt-2 text-[16px] font-medium text-[#596983]">
                  {totalQuestions > 0 ? `Soal 1 dari ${totalQuestions}` : "Soal belum tersedia"}
                </p>
                {exercise.title !== exercise.topic.title ? (
                  <p className="mt-3 text-[15px] leading-7 text-[#596983]">
                    Paket latihan: {exercise.title}
                    {exercise.material?.title ? ` • terkait materi ${exercise.material.title}` : ""}
                  </p>
                ) : null}
              </div>

              <ExercisePlayerClient exercise={exercise} />
            </section>

            <div className="min-h-[220px]" />
          </div>
        </div>
      </div>

      <StudentFooter />
    </main>
  );
}
