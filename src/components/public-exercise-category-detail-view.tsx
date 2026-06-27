import Link from "next/link";

import { PublicContentLayout } from "@/components/layouts/public-content-layout";
import { ExerciseCategoryTopics } from "@/components/exercise-category-browser";
import { buildHeaderMenus } from "@/components/student-dashboard/data";
import type { PublicExerciseCategoryDetail } from "@/lib/public-content";

type PublicExerciseCategoryDetailViewProps = {
  detail: PublicExerciseCategoryDetail;
};

export function PublicExerciseCategoryDetailView({ detail }: PublicExerciseCategoryDetailViewProps) {
  return (
    <PublicContentLayout homeHref="/" menus={buildHeaderMenus("/", "exercises")}>
      <section className="rounded-[24px] border border-[#d8e2f3] bg-white px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
        <Link href="/latihan" className="text-[14px] font-bold text-[#2563eb]">
          Kembali ke kategori latihan
        </Link>

        <div className="mt-8">
          <ExerciseCategoryTopics detail={detail} mode="public" />
        </div>
      </section>
    </PublicContentLayout>
  );
}
