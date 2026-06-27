import Link from "next/link";
import { BookOpen, ClipboardCheck, PlayCircle } from "lucide-react";

import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import { buildSidebarMenus } from "@/components/student-dashboard/data";
import { buildExerciseCategorySlug, type PublicTopicDetail } from "@/lib/public-content";
import { cn } from "@/lib/utils";

type StudentTopicDetailViewProps = {
  topic: PublicTopicDetail;
  displayName: string;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentTopicDetailView({
  topic,
  displayName,
  logoutAction,
}: StudentTopicDetailViewProps) {
  const exerciseCategorySlug = buildExerciseCategorySlug(topic.category, topic.difficulty);
  const topicExerciseCount = topic.exerciseSummary.totalTopicExercises;
  const categoryExerciseCount = topic.exerciseSummary.totalCategoryExercises;
  const topicPackageCount = topic.exerciseSummary.topicCount;
  const materialExerciseCount = topic.exerciseSummary.materialCount;

  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={buildSidebarMenus("/siswa", "topics")}
      logoutAction={logoutAction}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <Link href="/siswa/topik" className="text-[14px] font-bold text-[#2563eb]">
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
                  topic.previewMode === "PREVIEW" ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#fff4e5] text-[#b7791f]",
                )}
              >
                {topic.previewMode === "PREVIEW" ? "Ada materi preview" : "Topik premium"}
              </span>
            </div>

            <h1 className="mt-4 text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">{topic.title}</h1>
            <p className="mt-3 text-[15px] leading-8 text-[#596983]">
              {topic.summary?.trim() || "Topik ini siap kamu pelajari dari akun siswa sesuai akses yang tersedia."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[18px] border border-[#e3eaf6] bg-white px-4 py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Materi</p>
              <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{topic.materials.length}</p>
            </div>
            <div className="rounded-[18px] border border-[#e3eaf6] bg-white px-4 py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Latihan</p>
              <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{topicExerciseCount}</p>
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
                        isPreview ? "bg-[#eef4ff] text-[#2563eb]" : "bg-[#fff4e5] text-[#b7791f]",
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
                        isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#fff4e5] text-[#b7791f]",
                      )}
                    >
                      {isPreview ? "Preview" : "Premium"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-[20px] font-black text-[#1f2f46]">{material.title}</h2>
                  <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                    {material.description?.trim() || "Materi siap dibuka di website."}
                  </p>

                  <div className="mt-5 flex items-center gap-2 rounded-[16px] bg-[#f8fbff] px-4 py-3 text-[13px] font-medium text-[#596983]">
                    {!hasFile
                      ? "File materi belum diupload admin."
                      : isPreview
                        ? "Bisa dibuka langsung dari akun siswa."
                        : "Materi ini butuh upgrade premium."}
                  </div>

                  <div className="mt-5">
                    {!hasFile ? (
                      <span className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#eef2f8] text-[14px] font-bold text-[#94a3b8]">
                        File Belum Tersedia
                      </span>
                    ) : isPreview ? (
                      <Link
                        href={`/siswa/materi/${material.id}`}
                        className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#2563eb] text-[14px] font-bold text-white"
                      >
                        Lihat Materi
                      </Link>
                    ) : (
                      <span className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#eef2f8] text-[14px] font-bold text-[#94a3b8]">
                        Upgrade untuk Buka
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-[20px] border border-dashed border-[#d8e2f3] bg-white px-6 py-8 text-[15px] leading-8 text-[#596983]">
            Topik ini belum punya materi yang siap ditampilkan ke user.
          </div>
        )}

        <div className="mt-10 rounded-[24px] border border-[#d8e2f3] bg-white p-5 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[760px]">
              <h2 className="text-[24px] font-black tracking-tight text-[#1f2f46]">
                Latihan untuk topik ini
              </h2>
              <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                Latihan yang memang terhubung ke topik ini bisa kamu buka langsung dari sini. Untuk latihan umum per
                kategori, tetap gunakan halaman latihan kategori.
              </p>
            </div>
            <span className="w-fit rounded-full bg-[#eef4ff] px-3 py-2 text-[12px] font-bold text-[#2563eb]">
              {topicExerciseCount} latihan topik
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Latihan kategori</p>
              <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{categoryExerciseCount}</p>
            </div>
            <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Latihan topic</p>
              <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{topicPackageCount}</p>
            </div>
            <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
              <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7b8aa3]">Terkait materi</p>
              <p className="mt-2 text-[28px] font-black text-[#1f2f46]">{materialExerciseCount}</p>
            </div>
          </div>

          <div className="mt-6">
            {topicExerciseCount > 0 || categoryExerciseCount > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {topicExerciseCount > 0 ? (
                  <Link
                    href={`/siswa/topik/${topic.slug}/latihan`}
                    className="flex h-[46px] items-center justify-center rounded-[14px] bg-[#0f8a63] text-[14px] font-bold text-white sm:w-fit sm:px-6"
                  >
                    Buka Latihan Topik Ini
                  </Link>
                ) : null}
                {categoryExerciseCount > 0 ? (
                  <Link
                    href={`/siswa/latihan/kategori/${exerciseCategorySlug}`}
                    className="flex h-[46px] items-center justify-center rounded-[14px] border border-[#cfe8de] bg-white text-[14px] font-bold text-[#0f8a63] sm:w-fit sm:px-6"
                  >
                    Buka Latihan Kategori
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[16px] bg-[#f8fbff] px-4 py-3 text-[14px] leading-7 text-[#596983]">
                Latihan untuk topik ini maupun kategori terkait belum dipublish oleh admin.
              </div>
            )}
          </div>
        </div>
      </section>
    </StudentAppLayout>
  );
}
