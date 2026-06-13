import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { StudentExercisePage } from "@/components/student-exercise-page";
import { requireUserRole } from "@/lib/auth/session";
import { getLatestExerciseAttemptForStudent } from "@/lib/exercise-attempts";
import { getStudentExerciseDetail } from "@/lib/public-content";

type StudentExerciseDetailPageProps = {
  params: Promise<{ exerciseId: string }>;
};

export default async function StudentExerciseDetailPage({ params }: StudentExerciseDetailPageProps) {
  const user = await requireUserRole("STUDENT");
  const { exerciseId } = await params;
  const exercise = await getStudentExerciseDetail(exerciseId);
  const latestAttempt = await getLatestExerciseAttemptForStudent(exerciseId, user.id);

  if (!exercise) {
    notFound();
  }

  return (
    <StudentExercisePage
      exercise={exercise}
      logoutAction={logoutAction}
      displayName={user.name?.trim() || "Adik"}
      latestAttempt={latestAttempt}
    />
  );
}
