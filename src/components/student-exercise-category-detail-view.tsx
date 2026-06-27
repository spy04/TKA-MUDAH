import Link from "next/link";

import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import { ExerciseCategoryTopics } from "@/components/exercise-category-browser";
import { buildSidebarMenus } from "@/components/student-dashboard/data";
import type { PublicExerciseCategoryDetail } from "@/lib/public-content";

type StudentExerciseCategoryDetailViewProps = {
  detail: PublicExerciseCategoryDetail;
  displayName: string;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentExerciseCategoryDetailView({
  detail,
  displayName,
  logoutAction,
}: StudentExerciseCategoryDetailViewProps) {
  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={buildSidebarMenus("/siswa", "exercises")}
      logoutAction={logoutAction}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <Link href="/siswa/latihan" className="text-[14px] font-bold text-[#2563eb]">
          Kembali ke kategori latihan
        </Link>

        <div className="mt-8">
          <ExerciseCategoryTopics detail={detail} mode="student" />
        </div>
      </section>
    </StudentAppLayout>
  );
}
