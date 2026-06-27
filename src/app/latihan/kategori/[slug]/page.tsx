import { notFound } from "next/navigation";

import { PublicExerciseCategoryDetailView } from "@/components/public-exercise-category-detail-view";
import { getPublicExerciseCategoryDetail } from "@/lib/public-content";

type PublicExerciseCategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicExerciseCategoryDetailPage({
  params,
}: PublicExerciseCategoryDetailPageProps) {
  const { slug } = await params;
  const detail = await getPublicExerciseCategoryDetail(slug);

  if (!detail) {
    notFound();
  }

  return <PublicExerciseCategoryDetailView detail={detail} />;
}
