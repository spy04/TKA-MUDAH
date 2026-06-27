import { PublicContentLayout } from "@/components/layouts/public-content-layout";
import { ExerciseCategoryGrid } from "@/components/exercise-category-browser";
import { buildHeaderMenus } from "@/components/student-dashboard/data";
import type { PublicExerciseCategorySummary } from "@/lib/public-content";

type PublicExerciseCategoryListViewProps = {
  categories: PublicExerciseCategorySummary[];
};

export function PublicExerciseCategoryListView({ categories }: PublicExerciseCategoryListViewProps) {
  return (
    <PublicContentLayout homeHref="/" menus={buildHeaderMenus("/", "exercises")}>
      <section className="rounded-[24px] border border-[#d8e2f3] bg-white px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
        <div className="max-w-[760px]">
          <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-[#2563eb]">
            Latihan per kategori
          </span>
          <h1 className="mt-4 text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">
            Jelajahi latihan berdasarkan kategori
          </h1>
          <p className="mt-3 text-[15px] leading-8 text-[#596983]">
            Daftar ini langsung mengarah ke kombinasi kategori dan jenjang, jadi user tidak harus masuk ke topic dulu
            untuk menemukan latihan Math-SD, IPA-SMP, dan seterusnya.
          </p>
        </div>

        <div className="mt-8">
          <ExerciseCategoryGrid categories={categories} mode="public" />
        </div>
      </section>
    </PublicContentLayout>
  );
}
