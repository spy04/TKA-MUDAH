import { notFound } from "next/navigation";

import { PublicTopicExerciseView } from "@/components/public-topic-exercise-view";
import { getPublicTopicExercises } from "@/lib/public-content";

type PublicTopicExercisePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicTopicExercisePage({ params }: PublicTopicExercisePageProps) {
  const { slug } = await params;
  const topic = await getPublicTopicExercises(slug, ["PREVIEW"]);

  if (!topic) {
    notFound();
  }

  return <PublicTopicExerciseView topic={topic} />;
}
