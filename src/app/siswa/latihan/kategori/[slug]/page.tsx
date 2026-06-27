import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { StudentExerciseCategoryDetailView } from "@/components/student-exercise-category-detail-view";
import { requireUserRole } from "@/lib/auth/session";
import { getPublicExerciseCategoryDetail } from "@/lib/public-content";

type StudentExerciseCategoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudentExerciseCategoryDetailPage({
  params,
}: StudentExerciseCategoryDetailPageProps) {
  const user = await requireUserRole("STUDENT");
  const { slug } = await params;
  const detail = await getPublicExerciseCategoryDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <StudentExerciseCategoryDetailView
      detail={detail}
      displayName={user.name?.trim() || "Adik"}
      logoutAction={logoutAction}
    />
  );
}
