"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";

import { MathRichText } from "@/components/math-rich-text";
import { cn } from "@/lib/utils";
import type { PublicExerciseDetail } from "@/lib/public-content";

type ExercisePlayerClientProps = {
  exercise: PublicExerciseDetail;
};

function buildOptions(question: PublicExerciseDetail["questions"][number]) {
  return [
    { key: "A", text: question.optionA },
    { key: "B", text: question.optionB },
    { key: "C", text: question.optionC },
    { key: "D", text: question.optionD },
  ].filter((option): option is { key: "A" | "B" | "C" | "D"; text: string } => Boolean(option.text?.trim()));
}

export function ExercisePlayerClient({ exercise }: ExercisePlayerClientProps) {
  const questions = exercise.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="mt-6 rounded-[24px] border border-dashed border-[#d8e2f3] bg-white px-6 py-8 text-[15px] leading-8 text-[#596983]">
        Latihan ini sudah dipublish, tetapi soal belum diisi oleh admin.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = buildOptions(currentQuestion);
  const selectedForCurrent = selectedAnswers[currentQuestion.id] ?? [];
  const progressWidth = `${Math.max(((currentIndex + 1) / Math.max(questions.length, 1)) * 100, 10)}%`;
  const isMultipleChoice = currentQuestion.questionType === "MULTIPLE_CHOICE";
  const isEssay = currentQuestion.questionType === "ESSAY";

  function handleSelectOption(optionKey: string) {
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

  function goToQuestion(nextIndex: number) {
    setCurrentIndex(nextIndex);
    setShowExplanation(false);
  }

  return (
    <div>
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
                className="text-[28px] font-black tracking-tight text-[#1f2f46] [&_.katex]:text-[1em] [&_.katex-display]:my-3 [&_.katex-display]:overflow-x-auto"
              />
              {isMultipleChoice ? (
                <p className="mt-2 text-[13px] font-semibold text-[#596983]">Pilih lebih dari satu jawaban bila diperlukan.</p>
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
            <div className="rounded-[18px] border border-[#dce6f5] bg-[#f8fbff] px-5 py-5 text-[15px] leading-7 text-[#596983]">
              Soal ini berbentuk esai. Gunakan tombol pembahasan untuk melihat contoh jawaban atau arahan pengerjaan.
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
                    className={cn(
                      "flex min-h-[74px] items-center gap-4 rounded-[18px] border px-5 py-4 text-left transition-all",
                      isSelected
                        ? "border-[#2563eb] bg-[#eef4ff] shadow-[0_18px_26px_-24px_rgba(37,99,235,0.85)]"
                        : "border-[#cfdaf0] bg-white hover:border-[#9cb4e5]",
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

          {showExplanation ? (
            <div className="rounded-[20px] border border-[#d9e5fb] bg-[#f8fbff] px-5 py-5 text-[14px] leading-7 text-[#596983]">
              <p className="text-[15px] font-bold text-[#1f2f46]">Pembahasan</p>
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
          className="inline-flex h-[50px] items-center justify-center gap-2 rounded-[16px] border-2 border-[#2563eb] bg-white px-6 text-[16px] font-bold text-[#2563eb]"
        >
          <Lightbulb className="size-5" />
          {showExplanation ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}
        </button>

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
        </div>
      </div>
    </div>
  );
}
