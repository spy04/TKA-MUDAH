import { redirect } from "next/navigation";

import { requireUserRole } from "@/lib/auth/session";
import { getFirstStudentExerciseId } from "@/lib/public-content";

export default async function StudentLatihanLandingPage() {
  await requireUserRole("STUDENT");

  const exerciseId = await getFirstStudentExerciseId();

  if (!exerciseId) {
    redirect("/siswa/topik");
  }

  redirect(`/siswa/latihan/${exerciseId}`);
}
