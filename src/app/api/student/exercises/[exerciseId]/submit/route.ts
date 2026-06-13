import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getStudentExerciseDetail } from "@/lib/public-content";
import { submitExerciseAttempt, type SubmittedExerciseAnswer } from "@/lib/exercise-attempts";

type SubmitPayload = {
  answers?: SubmittedExerciseAnswer[];
};

export async function POST(
  request: Request,
  context: { params: Promise<{ exerciseId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return NextResponse.json({ message: "Kamu perlu login sebagai siswa." }, { status: 401 });
  }

  const { exerciseId } = await context.params;
  const exercise = await getStudentExerciseDetail(exerciseId);

  if (!exercise) {
    return NextResponse.json({ message: "Latihan tidak ditemukan." }, { status: 404 });
  }

  let payload: SubmitPayload;

  try {
    payload = (await request.json()) as SubmitPayload;
  } catch {
    return NextResponse.json({ message: "Format jawaban tidak valid." }, { status: 400 });
  }

  const answers = Array.isArray(payload.answers) ? payload.answers : [];

  const result = await submitExerciseAttempt({
    exercise,
    userId: session.user.id,
    answers,
  });

  return NextResponse.json({
    result,
  });
}
