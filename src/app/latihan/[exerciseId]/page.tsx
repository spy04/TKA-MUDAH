import { notFound } from "next/navigation";

import { ExerciseDetailView } from "@/components/exercise-detail-view";
import { getPublicExerciseDetail } from "@/lib/public-content";

type ExerciseDetailPageProps = {
  params: Promise<{ exerciseId: string }>;
};

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { exerciseId } = await params;
  const exercise = await getPublicExerciseDetail(exerciseId);

  if (!exercise) {
    notFound();
  }

  return <ExerciseDetailView exercise={exercise} />;
}
