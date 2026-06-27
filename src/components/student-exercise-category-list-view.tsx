import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import { ExerciseCategoryGrid } from "@/components/exercise-category-browser";
import { buildSidebarMenus } from "@/components/student-dashboard/data";
import type { PublicExerciseCategorySummary } from "@/lib/public-content";

type StudentExerciseCategoryListViewProps = {
  categories: PublicExerciseCategorySummary[];
  displayName: string;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentExerciseCategoryListView({
  categories,
  displayName,
  logoutAction,
}: StudentExerciseCategoryListViewProps) {
  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={buildSidebarMenus("/siswa", "exercises")}
      logoutAction={logoutAction}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <div className="max-w-[760px]">
          <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-[#2563eb]">
            Latihan per kategori
          </span>
          <h1 className="mt-4 text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">
            Pilih kategori latihan
          </h1>
          <p className="mt-3 text-[15px] leading-8 text-[#596983]">
            Sekarang latihan tidak mulai dari topic dulu. Kamu bisa langsung masuk ke kombinasi kategori dan jenjang
            seperti Math-SD, IPA-SMP, atau B. Indo-SD.
          </p>
        </div>

        <div className="mt-8">
          <ExerciseCategoryGrid categories={categories} mode="student" />
        </div>
      </section>
    </StudentAppLayout>
  );
}
