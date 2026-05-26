import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { ExerciseDetailView } from "@/components/exercise-detail-view";
import { requireUserRole } from "@/lib/auth/session";
import { getStudentExerciseDetail } from "@/lib/public-content";

type StudentExerciseDetailPageProps = {
  params: Promise<{ exerciseId: string }>;
};

export default async function StudentExerciseDetailPage({ params }: StudentExerciseDetailPageProps) {
  const user = await requireUserRole("STUDENT");
  const { exerciseId } = await params;
  const exercise = await getStudentExerciseDetail(exerciseId);

  if (!exercise) {
    notFound();
  }

  return (
    <ExerciseDetailView
      exercise={exercise}
      logoutAction={logoutAction}
      homeHref="/siswa"
      displayName={user.name?.trim() || "Adik"}
      isEnrolled
    />
  );
}
