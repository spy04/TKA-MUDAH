import { redirect } from "next/navigation";

import { getFirstPublicExerciseId } from "@/lib/public-content";

export default async function LatihanLandingPage() {
  const exerciseId = await getFirstPublicExerciseId();

  if (!exerciseId) {
    redirect("/topik");
  }

  redirect(`/latihan/${exerciseId}`);
}
