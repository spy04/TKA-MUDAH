import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { PublicExerciseDetail } from "@/lib/public-content";

export type SubmittedExerciseAnswer = {
  questionId: string;
  selectedOptions?: string[];
  essayAnswer?: string;
};

export type StudentExerciseAttemptResult = {
  id: string;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  essayCount: number;
  answeredCount: number;
  totalQuestions: number;
  submittedAt: string;
  answers: Record<
    string,
    {
      selectedOptions: string[];
      essayAnswer: string;
      isCorrect: boolean | null;
      awardedPoints: number;
    }
  >;
};

function normalizeOptionValues(values: string[] | undefined) {
  if (!values) {
    return [];
  }

  return [...new Set(values.map((value) => value.trim().toUpperCase()).filter(Boolean))].sort();
}

function normalizeTrueFalseSelections(values: string[] | undefined, statementKeys: string[]) {
  if (!values) {
    return [];
  }

  const decisions = new Map<string, "TRUE" | "FALSE">();

  for (const rawValue of values) {
    const value = rawValue.trim().toUpperCase();

    if (!value) {
      continue;
    }

    if (value.includes(":")) {
      const [key, decision] = value.split(":");

      if (!key || (decision !== "TRUE" && decision !== "FALSE")) {
        continue;
      }

      decisions.set(key, decision);
      continue;
    }

    if (statementKeys.includes(value)) {
      decisions.set(value, "TRUE");
    }
  }

  return statementKeys
    .filter((key) => decisions.has(key))
    .map((key) => `${key}:${decisions.get(key)}`);
}

function buildExpectedTrueFalseSelections(correctAnswers: string | null, statementKeys: string[]) {
  const trueKeys = normalizeOptionValues(correctAnswers?.split(","));

  return statementKeys.map((key) => `${key}:${trueKeys.includes(key) ? "TRUE" : "FALSE"}`);
}

function parseStoredOptions(value: string | null) {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapAttemptResult(attempt: {
  id: string;
  score: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  essayCount: number;
  answeredCount: number;
  totalQuestions: number;
  submittedAt: Date;
  answers: Array<{
    questionId: string;
    selectedOptions: string | null;
    essayAnswer: string | null;
    isCorrect: boolean | null;
    awardedPoints: number;
  }>;
}): StudentExerciseAttemptResult {
  return {
    id: attempt.id,
    score: attempt.score,
    maxScore: attempt.maxScore,
    correctCount: attempt.correctCount,
    incorrectCount: attempt.incorrectCount,
    unansweredCount: attempt.unansweredCount,
    essayCount: attempt.essayCount,
    answeredCount: attempt.answeredCount,
    totalQuestions: attempt.totalQuestions,
    submittedAt: attempt.submittedAt.toISOString(),
    answers: Object.fromEntries(
      attempt.answers.map((answer) => [
        answer.questionId,
        {
          selectedOptions: parseStoredOptions(answer.selectedOptions),
          essayAnswer: answer.essayAnswer ?? "",
          isCorrect: answer.isCorrect,
          awardedPoints: answer.awardedPoints,
        },
      ]),
    ),
  };
}

export const getLatestExerciseAttemptForStudent = cache(
  async (exerciseId: string, userId: string): Promise<StudentExerciseAttemptResult | null> => {
    const attempt = await prisma.exerciseAttempt.findFirst({
      where: {
        exerciseId,
        userId,
      },
      orderBy: {
        submittedAt: "desc",
      },
      select: {
        id: true,
        score: true,
        maxScore: true,
        correctCount: true,
        incorrectCount: true,
        unansweredCount: true,
        essayCount: true,
        answeredCount: true,
        totalQuestions: true,
        submittedAt: true,
        answers: {
          select: {
            questionId: true,
            selectedOptions: true,
            essayAnswer: true,
            isCorrect: true,
            awardedPoints: true,
          },
        },
      },
    });

    if (!attempt) {
      return null;
    }

    return mapAttemptResult(attempt);
  },
);

export async function submitExerciseAttempt(params: {
  exercise: PublicExerciseDetail;
  userId: string;
  answers: SubmittedExerciseAnswer[];
}) {
  const { exercise, userId, answers } = params;
  const answerMap = new Map(answers.map((answer) => [answer.questionId, answer]));

  let score = 0;
  let maxScore = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  let essayCount = 0;
  let answeredCount = 0;

  const answerRows = exercise.questions.map((question) => {
    const incoming = answerMap.get(question.id);
    const statementKeys =
      question.questionType === "TRUE_FALSE"
        ? ["A", "B", "C", "D", "E"].filter((key) => {
            const optionValue =
              key === "A"
                ? question.optionA
                : key === "B"
                  ? question.optionB
                  : key === "C"
                    ? question.optionC
                    : key === "D"
                      ? question.optionD
                      : question.optionE;

            return Boolean(optionValue?.trim());
          })
        : [];
    const selectedOptions =
      question.questionType === "TRUE_FALSE"
        ? normalizeTrueFalseSelections(incoming?.selectedOptions, statementKeys)
        : normalizeOptionValues(incoming?.selectedOptions);
    const essayAnswer = incoming?.essayAnswer?.trim() ?? "";
    const hasAnswer =
      question.questionType === "ESSAY" ? essayAnswer.length > 0 : selectedOptions.length > 0;

    if (hasAnswer) {
      answeredCount += 1;
    } else {
      unansweredCount += 1;
    }

    if (question.questionType === "ESSAY") {
      essayCount += 1;

      return {
        questionId: question.id,
        selectedOptions: selectedOptions.join(",") || null,
        essayAnswer: essayAnswer || null,
        isCorrect: null,
        awardedPoints: 0,
      };
    }

    maxScore += question.points;

    let isCorrect = false;

    if (question.questionType === "TRUE_FALSE") {
      const expected = buildExpectedTrueFalseSelections(question.correctAnswers, statementKeys);
      isCorrect =
        expected.length > 0 &&
        expected.length === selectedOptions.length &&
        expected.every((value, index) => value === selectedOptions[index]);
    } else if (question.questionType === "MULTIPLE_CHOICE") {
      const expected = normalizeOptionValues(question.correctAnswers?.split(","));
      isCorrect =
        expected.length > 0 &&
        expected.length === selectedOptions.length &&
        expected.every((value, index) => value === selectedOptions[index]);
    } else {
      isCorrect = selectedOptions.length === 1 && selectedOptions[0] === question.correctAnswer;
    }

    const awardedPoints = isCorrect ? question.points : 0;
    score += awardedPoints;

    if (hasAnswer) {
      if (isCorrect) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    }

    return {
      questionId: question.id,
      selectedOptions: selectedOptions.join(",") || null,
      essayAnswer: essayAnswer || null,
      isCorrect,
      awardedPoints,
    };
  });

  const attempt = await prisma.exerciseAttempt.create({
    data: {
      exerciseId: exercise.id,
      userId,
      score,
      maxScore,
      correctCount,
      incorrectCount,
      unansweredCount,
      essayCount,
      answeredCount,
      totalQuestions: exercise.questions.length,
      answers: {
        create: answerRows,
      },
    },
    select: {
      id: true,
      score: true,
      maxScore: true,
      correctCount: true,
      incorrectCount: true,
      unansweredCount: true,
      essayCount: true,
      answeredCount: true,
      totalQuestions: true,
      submittedAt: true,
      answers: {
        select: {
          questionId: true,
          selectedOptions: true,
          essayAnswer: true,
          isCorrect: true,
          awardedPoints: true,
        },
      },
    },
  });

  return mapAttemptResult(attempt);
}
