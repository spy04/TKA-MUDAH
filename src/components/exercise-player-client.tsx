"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, LoaderCircle, SendHorizonal } from "lucide-react";

import { MathRichText } from "@/components/math-rich-text";
import type { StudentExerciseAttemptResult } from "@/lib/exercise-attempts";
import { cn } from "@/lib/utils";
import type { PublicExerciseDetail } from "@/lib/public-content";

type ExercisePlayerClientProps = {
  exercise: PublicExerciseDetail;
  initialAttempt?: StudentExerciseAttemptResult | null;
};

function buildOptions(question: PublicExerciseDetail["questions"][number]) {
  return [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
    { key: "E", text: question.optionE },
  ].filter((option): option is { key: "A" | "B" | "C" | "D" | "E"; text: string } => Boolean(option.text?.trim()));
}

function buildTrueFalseStatements(question: PublicExerciseDetail["questions"][number]) {
  return [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
    { key: "E", text: question.optionE },
  ].filter((statement): statement is { key: "A" | "B" | "C" | "D" | "E"; text: string } => Boolean(statement.text?.trim()));
}

function parseTrueFalseSelection(values: string[]) {
  const selections: Record<string, boolean> = {};

  for (const rawValue of values) {
    const value = rawValue.trim().toUpperCase();

    if (!value) {
      continue;
    }

    if (value.includes(":")) {
      const [key, decision] = value.split(":");

      if (!key) {
        continue;
      }

      selections[key] = decision === "TRUE";
      continue;
    }

    selections[value] = true;
  }

  return selections;
}

function buildTrueFalseSelectionValues(
  currentValues: string[],
  statementKey: string,
  decision: boolean,
  statementKeys: string[],
) {
  const selections = parseTrueFalseSelection(currentValues);
  selections[statementKey] = decision;

  return statementKeys
    .filter((key) => key in selections)
    .map((key) => `${key}:${selections[key] ? "TRUE" : "FALSE"}`);
}

function buildAnswerKeySummary(question: PublicExerciseDetail["questions"][number]) {
  if (question.questionType === "ESSAY") {
    return question.sampleAnswer?.trim()
      ? "Contoh jawaban tersedia di bagian pembahasan."
      : null;
  }

  if (question.questionType === "MULTIPLE_CHOICE" || question.questionType === "TRUE_FALSE") {
    return question.correctAnswers?.trim()
      ? question.questionType === "TRUE_FALSE"
        ? `Pernyataan benar: ${question.correctAnswers}`
        : `Kunci jawaban: ${question.correctAnswers}`
      : null;
  }

  return question.correctAnswer ? `Kunci jawaban: ${question.correctAnswer}` : null;
}

export function ExercisePlayerClient({ exercise, initialAttempt }: ExercisePlayerClientProps) {
  const questions = exercise.questions;
  const resolvedInitialAttempt = initialAttempt ?? null;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>(
    resolvedInitialAttempt
      ? Object.fromEntries(
          Object.entries(resolvedInitialAttempt.answers).map(([questionId, answer]) => [questionId, answer.selectedOptions]),
        )
      : {},
  );
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>(
    resolvedInitialAttempt
      ? Object.fromEntries(
          Object.entries(resolvedInitialAttempt.answers).map(([questionId, answer]) => [questionId, answer.essayAnswer]),
        )
      : {},
  );
  const [attemptResult, setAttemptResult] = useState<StudentExerciseAttemptResult | null>(resolvedInitialAttempt);
  const [showExplanation, setShowExplanation] = useState(Boolean(resolvedInitialAttempt));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  if (questions.length === 0) {
    return (
      <div className="mt-6 rounded-[24px] border border-dashed border-[#d8e2f3] bg-white px-6 py-8 text-[15px] leading-8 text-[#596983]">
        Latihan ini sudah dipublish, tetapi soal belum diisi oleh admin.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = buildOptions(currentQuestion);
  const trueFalseStatements = buildTrueFalseStatements(currentQuestion);
  const selectedForCurrent = selectedAnswers[currentQuestion.id] ?? [];
  const trueFalseSelection = parseTrueFalseSelection(selectedForCurrent);
  const progressWidth = `${Math.max(((currentIndex + 1) / Math.max(questions.length, 1)) * 100, 10)}%`;
  const isMultipleChoice =
    currentQuestion.questionType === "MULTIPLE_CHOICE" || currentQuestion.questionType === "TRUE_FALSE";
  const isEssay = currentQuestion.questionType === "ESSAY";
  const isTrueFalse = currentQuestion.questionType === "TRUE_FALSE";
  const answerKeySummary = buildAnswerKeySummary(currentQuestion);
  const hasSubmitted = Boolean(attemptResult);
  const resultForCurrent = attemptResult?.answers[currentQuestion.id] ?? null;
  const answeredQuestionsCount = useMemo(
    () =>
      questions.filter((question) => {
        if (question.questionType === "ESSAY") {
          return Boolean(essayAnswers[question.id]?.trim());
        }

        return (selectedAnswers[question.id] ?? []).length > 0;
      }).length,
    [essayAnswers, questions, selectedAnswers],
  );

  function handleSelectOption(optionKey: string) {
    if (hasSubmitted) {
      return;
    }

    setSelectedAnswers((previous) => {
      const current = previous[currentQuestion.id] ?? [];

      if (isMultipleChoice) {
        return {
          ...previous,
          [currentQuestion.id]: current.includes(optionKey)
            ? current.filter((item) => item !== optionKey)
            : [...current, optionKey],
        };
      }

      return {
        ...previous,
        [currentQuestion.id]: [optionKey],
      };
    });
  }

  function handleTrueFalseSelect(statementKey: string, decision: boolean) {
    if (hasSubmitted) {
      return;
    }

    setSelectedAnswers((previous) => {
      const current = previous[currentQuestion.id] ?? [];

      return {
        ...previous,
        [currentQuestion.id]: buildTrueFalseSelectionValues(
          current,
          statementKey,
          decision,
          trueFalseStatements.map((statement) => statement.key),
        ),
      };
    });
  }

  function handleEssayChange(value: string) {
    if (hasSubmitted) {
      return;
    }

    setEssayAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: value,
    }));
  }

  function goToQuestion(nextIndex: number) {
    setCurrentIndex(nextIndex);
    setShowExplanation(hasSubmitted);
  }

  async function handleSubmit() {
    if (hasSubmitted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const answers = questions.map((question) => ({
        questionId: question.id,
        selectedOptions: selectedAnswers[question.id] ?? [],
        essayAnswer: essayAnswers[question.id] ?? "",
      }));

      const response = await fetch(`/api/student/exercises/${exercise.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const payload = (await response.json()) as {
        message?: string;
        result?: StudentExerciseAttemptResult;
      };

      if (!response.ok || !payload.result) {
        setSubmitMessage(payload.message || "Submit jawaban belum berhasil.");
        return;
      }

      setAttemptResult(payload.result);
      setShowExplanation(true);
      setSubmitMessage("Jawaban berhasil disimpan. Kamu sekarang bisa melihat pembahasan.");
    } catch {
      setSubmitMessage("Terjadi kendala saat menyimpan jawaban. Coba lagi beberapa saat.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      {attemptResult ? (
        <div className="rounded-[22px] border border-[#dce5f4] bg-white px-5 py-5 shadow-[0_18px_34px_-30px_rgba(15,23,42,0.35)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e7f8f1] px-3 py-1 text-[12px] font-bold text-[#0f8a63]">
                <CheckCircle2 className="size-4" />
                Sudah Disubmit
              </div>
              <p className="mt-3 text-[24px] font-black text-[#1f2f46]">
                Skor kamu {attemptResult.score}
                <span className="text-[18px] font-semibold text-[#73829b]"> / {attemptResult.maxScore}</span>
              </p>
              <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                {attemptResult.correctCount} benar, {attemptResult.incorrectCount} salah, {attemptResult.unansweredCount} belum dijawab
                {attemptResult.essayCount > 0 ? `, ${attemptResult.essayCount} esai belum dinilai otomatis` : ""}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[16px] bg-[#f8fbff] px-4 py-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#73829b]">Terjawab</p>
                <p className="mt-1 text-[20px] font-black text-[#2563eb]">{attemptResult.answeredCount}</p>
              </div>
              <div className="rounded-[16px] bg-[#f8fbff] px-4 py-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#73829b]">Benar</p>
                <p className="mt-1 text-[20px] font-black text-[#0f8a63]">{attemptResult.correctCount}</p>
              </div>
              <div className="rounded-[16px] bg-[#f8fbff] px-4 py-3 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#73829b]">Belum Dijawab</p>
                <p className="mt-1 text-[20px] font-black text-[#b7791f]">{attemptResult.unansweredCount}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="h-[16px] rounded-full bg-[#e4ecfb]">
          <div
            className="h-full rounded-full bg-[#0f8a63] transition-all duration-300"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      <section className="mt-6 rounded-[28px] bg-white px-6 py-7 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.45)] lg:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-[#1f57f3] text-[20px] font-black text-white">
              {currentIndex + 1}
            </div>
            <div className="min-w-0 flex-1">
              <MathRichText
                text={currentQuestion.prompt}
                className="text-[16px] leading-[1.5] text-[#1f2f46] [&_.katex]:text-[1em] [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto"
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <p className="text-[13px] font-semibold text-[#0f8a63]">{currentQuestion.points} poin</p>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-[#2563eb]">
                  {isEssay
                    ? "Esai"
                    : isTrueFalse
                      ? "Benar / Salah"
                    : isMultipleChoice
                      ? "Pilihan ganda kompleks"
                      : "Pilihan ganda"}
                </span>
              </div>
              {isMultipleChoice ? (
                <p className="mt-2 text-[13px] font-semibold text-[#596983]">
                  {isTrueFalse
                    ? "Pilih semua pernyataan yang benar."
                    : "Pilih lebih dari satu jawaban bila diperlukan."}
                </p>
              ) : null}
            </div>
          </div>

          {exercise.material?.coverUrl ? (
            <div className="overflow-hidden rounded-[24px] border border-[#dce6f5] bg-[#edf8f6]">
              <Image
                src={exercise.material.coverUrl}
                alt={exercise.material.title}
                width={1200}
                height={720}
                unoptimized
                className="h-[220px] w-full object-cover lg:h-[260px]"
              />
            </div>
          ) : null}

          {isEssay ? (
            <div className="rounded-[18px] border border-[#dce6f5] bg-[#f8fbff] px-5 py-5">
              <label className="block">
                <span className="text-[14px] font-bold text-[#1f2f46]">Jawaban esai</span>
                <textarea
                  value={essayAnswers[currentQuestion.id] ?? ""}
                  onChange={(event) => handleEssayChange(event.target.value)}
                  disabled={hasSubmitted}
                  placeholder="Tulis jawabanmu di sini..."
                  className="mt-3 min-h-[160px] w-full rounded-[16px] border border-[#d3dff5] bg-white px-4 py-4 text-[15px] leading-7 text-[#1f2f46] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#dbe8ff] disabled:cursor-not-allowed disabled:bg-[#f2f5fb]"
                />
              </label>
              <p className="mt-3 text-[13px] leading-6 text-[#596983]">
                Jawaban esai akan ikut tersimpan saat submit. Nilai esai belum dihitung otomatis.
              </p>
            </div>
          ) : isTrueFalse ? (
            <div className="overflow-hidden rounded-[20px] border border-[#dce6f5] bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8fbff]">
                      <th className="border-b border-r border-[#dce6f5] px-4 py-4 text-left text-[14px] font-bold text-[#1f2f46]">
                        Pernyataan
                      </th>
                      <th className="border-b border-r border-[#dce6f5] px-4 py-4 text-center text-[14px] font-bold text-[#1f2f46]">
                        Benar
                      </th>
                      <th className="border-b border-[#dce6f5] px-4 py-4 text-center text-[14px] font-bold text-[#1f2f46]">
                        Salah
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {trueFalseStatements.map((statement) => {
                      const rowSelection = trueFalseSelection[statement.key];
                      const isTrueSelected = rowSelection === true;
                      const isFalseSelected = rowSelection === false;

                      return (
                        <tr key={statement.key} className="align-top">
                          <td className="border-b border-r border-[#dce6f5] px-4 py-4 text-[15px] text-[#1f2f46] last:border-b-0">
                            <div className="flex gap-3">
                              <span className="min-w-[28px] font-bold text-[#1f2f46]">{statement.key}.</span>
                              <MathRichText
                                text={statement.text}
                                className="min-w-0 leading-7 [&_.katex]:text-[1em] [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto"
                              />
                            </div>
                          </td>
                          <td className="border-b border-r border-[#dce6f5] px-3 py-3 text-center last:border-b-0">
                            <button
                              type="button"
                              onClick={() => handleTrueFalseSelect(statement.key, true)}
                              disabled={hasSubmitted}
                              aria-pressed={isTrueSelected}
                              className={cn(
                                "mx-auto flex size-11 items-center justify-center rounded-[14px] border transition-all",
                                isTrueSelected
                                  ? "border-[#0f8a63] bg-[#e7f8f1] text-[#0f8a63] shadow-[0_14px_22px_-18px_rgba(15,138,99,0.7)]"
                                  : "border-[#cfdaf0] bg-white text-[#94a3b8] hover:border-[#0f8a63] hover:text-[#0f8a63]",
                                hasSubmitted && "cursor-not-allowed",
                              )}
                            >
                              <CheckCircle2 className="size-5" />
                            </button>
                          </td>
                          <td className="border-b border-[#dce6f5] px-3 py-3 text-center last:border-b-0">
                            <button
                              type="button"
                              onClick={() => handleTrueFalseSelect(statement.key, false)}
                              disabled={hasSubmitted}
                              aria-pressed={isFalseSelected}
                              className={cn(
                                "mx-auto flex size-11 items-center justify-center rounded-[14px] border transition-all",
                                isFalseSelected
                                  ? "border-[#b7791f] bg-[#fff4e5] text-[#b7791f] shadow-[0_14px_22px_-18px_rgba(183,121,31,0.7)]"
                                  : "border-[#cfdaf0] bg-white text-[#94a3b8] hover:border-[#b7791f] hover:text-[#b7791f]",
                                hasSubmitted && "cursor-not-allowed",
                              )}
                            >
                              <CheckCircle2 className="size-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {options.map((option) => {
                const isSelected = selectedForCurrent.includes(option.key);

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleSelectOption(option.key)}
                    disabled={hasSubmitted}
                    className={cn(
                      "flex min-h-[74px] items-center gap-4 rounded-[18px] border px-5 py-4 text-left transition-all",
                      isSelected
                        ? "border-[#2563eb] bg-[#eef4ff] shadow-[0_18px_26px_-24px_rgba(37,99,235,0.85)]"
                        : "border-[#cfdaf0] bg-white hover:border-[#9cb4e5]",
                      hasSubmitted && "cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-[16px] font-black",
                        isSelected
                          ? "border-[#2563eb] bg-[#2563eb] text-white"
                          : "border-[#b7c5de] bg-white text-[#1f2f46]",
                      )}
                    >
                      {option.key}
                    </span>
                    <MathRichText
                      text={option.text}
                      inline
                      className="min-w-0 text-[17px] font-semibold text-[#1f2f46] [&_.katex]:text-[1em]"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {showExplanation && hasSubmitted ? (
            <div className="rounded-[20px] border border-[#d9e5fb] bg-[#f8fbff] px-5 py-5 text-[14px] leading-7 text-[#596983]">
              <p className="text-[15px] font-bold text-[#1f2f46]">Pembahasan</p>
              {answerKeySummary ? (
                <p className="mt-2 rounded-[14px] bg-white px-4 py-3 text-[13px] font-semibold text-[#2563eb]">
                  {answerKeySummary}
                </p>
              ) : null}
              {resultForCurrent && !isEssay ? (
                <p
                  className={cn(
                    "mt-2 rounded-[14px] px-4 py-3 text-[13px] font-semibold",
                    resultForCurrent.isCorrect
                      ? "bg-[#edf8f2] text-[#0f8a63]"
                      : "bg-[#fff4e5] text-[#b7791f]",
                  )}
                >
                  {resultForCurrent.isCorrect
                    ? `Jawabanmu benar. Poin didapat: ${resultForCurrent.awardedPoints}.`
                    : `Jawabanmu belum tepat. Poin didapat: ${resultForCurrent.awardedPoints}.`}
                </p>
              ) : null}
              <MathRichText
                text={
                  currentQuestion.explanation?.trim() ||
                  currentQuestion.sampleAnswer?.trim() ||
                  "Pembahasan belum diisi admin untuk soal ini."
                }
                className="mt-2 [&_.katex]:text-[1em] [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto"
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => setShowExplanation((value) => !value)}
          disabled={!hasSubmitted}
          className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[16px] border-2 border-[#2563eb] bg-white px-6 text-[16px] font-bold text-[#2563eb]"
        >
          <Lightbulb className="size-5" />
          {hasSubmitted
            ? showExplanation
              ? "Sembunyikan Pembahasan"
              : "Lihat Pembahasan"
            : "Pembahasan aktif setelah submit"}
        </button>

        <div className="flex flex-col gap-3 lg:items-end">
          {!hasSubmitted ? (
            <div className="rounded-[14px] bg-[#f8fbff] px-4 py-3 text-[13px] text-[#596983]">
              {answeredQuestionsCount} dari {questions.length} soal sudah terisi.
            </div>
          ) : null}

          {submitMessage ? (
            <p className="text-[13px] font-medium text-[#596983]">{submitMessage}</p>
          ) : null}

          <div className="flex items-center gap-4 self-end">
          <button
            type="button"
            onClick={() => goToQuestion(Math.max(currentIndex - 1, 0))}
            disabled={currentIndex === 0}
            className={cn(
              "inline-flex h-[50px] min-w-[164px] items-center justify-center gap-2 rounded-[16px] px-6 text-[16px] font-bold transition-colors",
              currentIndex === 0 ? "bg-[#d9e5fb] text-[#5f6d83]" : "border border-[#d3dff5] bg-white text-[#1f2f46]",
            )}
          >
            <ChevronLeft className="size-5" />
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={() => goToQuestion(Math.min(currentIndex + 1, questions.length - 1))}
            disabled={currentIndex === questions.length - 1}
            className={cn(
              "inline-flex h-[50px] min-w-[164px] items-center justify-center gap-2 rounded-[16px] px-6 text-[16px] font-bold transition-colors",
              currentIndex === questions.length - 1
                ? "bg-[#d9e5fb] text-[#5f6d83]"
                : "bg-[#1f57f3] text-white shadow-[0_18px_28px_-24px_rgba(31,87,243,0.95)]",
            )}
          >
            Selanjutnya
            <ChevronRight className="size-5" />
          </button>
            {!hasSubmitted ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex h-[50px] min-w-[180px] items-center justify-center gap-2 rounded-[16px] bg-[#0f8a63] px-6 text-[16px] font-bold text-white shadow-[0_18px_28px_-24px_rgba(15,138,99,0.95)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SendHorizonal className="size-5" />
                    Submit Jawaban
                  </>
                )}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
