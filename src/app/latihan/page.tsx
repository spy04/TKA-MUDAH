import { redirect } from "next/navigation";

import { getFirstStudentExerciseId } from "@/lib/public-content";

export default async function LatihanLandingPage() {
  const exerciseId = await getFirstStudentExerciseId();

  if (!exerciseId) {
    redirect("/masuk");
  }

  redirect(`/masuk?callbackUrl=${encodeURIComponent(`/siswa/latihan/${exerciseId}`)}`);
}
