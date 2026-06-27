import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { StudentTopicExerciseView } from "@/components/student-topic-exercise-view";
import { requireUserRole } from "@/lib/auth/session";
import { getPublicTopicExercises } from "@/lib/public-content";

type StudentTopicExercisePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudentTopicExercisePage({ params }: StudentTopicExercisePageProps) {
  const user = await requireUserRole("STUDENT");
  const { slug } = await params;
  const topic = await getPublicTopicExercises(slug, ["PREVIEW", "ENROLLED"]);

  if (!topic) {
    notFound();
  }

  return (
    <StudentTopicExerciseView
      topic={topic}
      displayName={user.name?.trim() || "Adik"}
      logoutAction={logoutAction}
    />
  );
}
