import Link from "next/link";
import { BookOpen, ClipboardCheck, Lock, PlayCircle } from "lucide-react";

import { buildHeaderMenus, buildSidebarMenus } from "@/components/student-dashboard/data";
import { StudentFooter } from "@/components/student-dashboard/student-footer";
import { StudentNavbar } from "@/components/student-dashboard/student-navbar";
import { StudentSidebar } from "@/components/student-dashboard/student-sidebar";
import type { PublicTopicDetail } from "@/lib/public-content";
import { cn } from "@/lib/utils";

type TopicDetailViewProps = {
  topic: PublicTopicDetail;
  displayName: string;
  homeHref: string;
  isEnrolled?: boolean;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function TopicDetailView({
  topic,
  displayName,
  homeHref,
  isEnrolled = false,
  logoutAction,
}: TopicDetailViewProps) {
  const avatarText = displayName.charAt(0).toUpperCase();
  const headerMenus = buildHeaderMenus(homeHref, "topics");
  const sidebarMenus = buildSidebarMenus(homeHref, "topics");

  return (
    <main className="min-h-screen bg-[#eaf1ff] text-[#1f2f46]">
      <StudentNavbar avatarText={avatarText} homeHref={homeHref} menus={headerMenus} />

      <div className="bg-[#f5f8ff]">
        <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 lg:px-6">
          <div className="hidden self-start pt-2 lg:sticky lg:top-[84px] lg:block">
            <StudentSidebar displayName={displayName} menus={sidebarMenus} logoutAction={logoutAction} />
          </div>

          <div className="min-w-0 flex-1">
            <section className="rounded-[24px] border border-[#d8e2f3] bg-white px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
              <Link href={isEnrolled ? "/siswa/topik" : "/topik"} className="text-[14px] font-bold text-[#2563eb]">
                Kembali ke semua topik
              </Link>

              <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[760px]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-[#2563eb]">
                      {topic.category}
                    </span>
                    <span className="rounded-full bg-[#f8fbff] px-3 py-1 text-[12px] font-bold text-[#73829b]">
                      {topic.difficulty}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[12px] font-bold",
                        topic.previewMode === "PREVIEW" ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                      )}
                    >
                      {topic.previewMode === "PREVIEW" ? "Ada materi preview" : "Mayoritas materi enrolled"}
                    </span>
                  </div>

                  <h1 className="mt-4 text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">
                    {topic.title}
                  </h1>
                  <p className="mt-3 text-[15px] leading-8 text-[#596983]">
                    {topic.summary?.trim() || "Topik ini sudah dipublish dan siap dibuka sesuai level akses materinya."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
                    <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Materi</p>
                    <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{topic.materials.length}</p>
                  </div>
                  <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
                    <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Akses</p>
                    <p className="mt-2 text-[20px] font-black text-[#1f2f46]">
                      {topic.previewMode === "PREVIEW" ? "Preview + Enrolled" : "Enrolled"}
                    </p>
                  </div>
                </div>
              </div>

              {topic.materials.length > 0 ? (
                <div className="mt-8 grid gap-4 lg:grid-cols-2">
                  {topic.materials.map((material) => {
                    const isPreview = material.accessLevel === "PREVIEW";
                    const hasFile = Boolean(material.fileUrl);

                    return (
                      <article
                        key={material.id}
                        className="rounded-[20px] border border-[#e3eaf6] bg-white p-5 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={cn(
                              "flex size-12 items-center justify-center rounded-[14px]",
                              isPreview ? "bg-[#eef4ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                            )}
                          >
                            {material.type === "VIDEO" ? (
                              <PlayCircle className="size-5" />
                            ) : material.type === "PDF" ? (
                              <BookOpen className="size-5" />
                            ) : (
                              <ClipboardCheck className="size-5" />
                            )}
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-[11px] font-bold",
                              isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                            )}
                          >
                            {isPreview ? "Preview" : "Enrolled"}
                          </span>
                        </div>

                        <h2 className="mt-4 text-[20px] font-black text-[#1f2f46]">{material.title}</h2>
                        <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                          {material.description?.trim() || "Materi siap dibuka di website."}
                        </p>

                        <div className="mt-5 flex items-center gap-2 rounded-[16px] bg-[#f8fbff] px-4 py-3 text-[13px] font-medium text-[#596983]">
                          <Lock className="size-4 shrink-0" />
                          {!hasFile
                            ? "File materi belum diupload admin"
                            : isPreview
                              ? "Bisa dibuka langsung di website"
                              : "Butuh akun siswa untuk membuka materi ini"}
                        </div>

                        <div className="mt-5">
                          {!hasFile ? (
                            <span className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#eef2f8] text-[14px] font-bold text-[#94a3b8]">
                              File Belum Tersedia
                            </span>
                          ) : isPreview ? (
                            <Link
                              href={`/materi/${material.id}`}
                              className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#2563eb] text-[14px] font-bold text-white"
                            >
                              Lihat Materi
                            </Link>
                          ) : isEnrolled ? (
                            <Link
                              href={`/siswa/materi/${material.id}`}
                              className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#0f8a63] text-[14px] font-bold text-white"
                            >
                              Buka Materi Enrolled
                            </Link>
                          ) : (
                            <Link
                              href="/siswa"
                              className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#edf8f2] text-[14px] font-bold text-[#0f8a63]"
                            >
                              Daftar / Masuk untuk Akses
                            </Link>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-8 rounded-[20px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-6 py-8 text-[15px] leading-8 text-[#596983]">
                  Topic ini sudah dipublish, tapi belum punya materi yang siap ditampilkan ke user.
                </div>
              )}

              <div className="mt-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[24px] font-black tracking-tight text-[#1f2f46]">Latihan Soal</h2>
                    <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                      Kerjakan latihan yang sudah dipublish untuk topik ini langsung di website.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eef4ff] px-3 py-2 text-[12px] font-bold text-[#2563eb]">
                    {topic.exercises.length} latihan
                  </span>
                </div>

                {topic.exercises.length > 0 ? (
                  <div className="mt-6 grid gap-4 lg:grid-cols-2">
                    {topic.exercises.map((exercise) => {
                      const isPreview = exercise.accessLevel === "PREVIEW";
                      const exerciseHref = isEnrolled
                        ? `/siswa/latihan/${exercise.id}`
                        : isPreview
                          ? `/latihan/${exercise.id}`
                          : "/siswa";

                      return (
                        <article
                          key={exercise.id}
                          className="rounded-[20px] border border-[#e3eaf6] bg-white p-5 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div
                              className={cn(
                                "flex size-12 items-center justify-center rounded-[14px]",
                                isPreview ? "bg-[#eef4ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                              )}
                            >
                              <ClipboardCheck className="size-5" />
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-[11px] font-bold",
                                isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                              )}
                            >
                              {isPreview ? "Preview" : "Enrolled"}
                            </span>
                          </div>

                          <h3 className="mt-4 text-[20px] font-black text-[#1f2f46]">{exercise.title}</h3>
                          <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                            {exercise.questionCount} soal
                            {exercise.materialTitle ? ` • terkait materi ${exercise.materialTitle}` : " • latihan topik langsung"}
                          </p>

                          <div className="mt-5 flex items-center gap-2 rounded-[16px] bg-[#f8fbff] px-4 py-3 text-[13px] font-medium text-[#596983]">
                            <Lock className="size-4 shrink-0" />
                            {isPreview
                              ? "Bisa dikerjakan tanpa daftar"
                              : isEnrolled
                                ? "Bisa langsung dikerjakan dari akun siswa"
                                : "Perlu daftar atau masuk untuk mengerjakan latihan ini"}
                          </div>

                          <div className="mt-5">
                            <Link
                              href={exerciseHref}
                              className={cn(
                                "flex h-[44px] items-center justify-center rounded-[12px] text-[14px] font-bold",
                                isPreview
                                  ? "bg-[#2563eb] text-white"
                                  : isEnrolled
                                    ? "bg-[#0f8a63] text-white"
                                    : "bg-[#edf8f2] text-[#0f8a63]",
                              )}
                            >
                              {isPreview ? "Mulai Latihan" : isEnrolled ? "Buka Latihan" : "Daftar / Masuk untuk Akses"}
                            </Link>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 rounded-[20px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-6 py-8 text-[15px] leading-8 text-[#596983]">
                    Latihan untuk topik ini belum dipublish oleh admin.
                  </div>
                )}
              </div>
            </section>

            <div className="min-h-[220px]" />
          </div>
        </div>
      </div>

      <StudentFooter />
    </main>
  );
}
