import Link from "next/link";
import { BookOpen, Check, Filter, Lock, PlayCircle, Presentation } from "lucide-react";

import { PublicContentLayout } from "@/components/layouts/public-content-layout";
import { buildHeaderMenus } from "@/components/student-dashboard/data";
import type { StudentDashboardData } from "@/lib/student-dashboard";
import { cn } from "@/lib/utils";

type PublicTopicCatalogViewProps = {
  dashboardData: StudentDashboardData;
};

function getTopicLevel(category: string) {
  const lower = category.toLowerCase();

  if (lower.includes("smp") || lower.includes("kelas 7") || lower.includes("kelas 8") || lower.includes("kelas 9")) {
    return "SMP";
  }

  return "SD";
}

function getTopicCardTheme(index: number) {
  const themes = [
    {
      mediaClassName: "bg-[radial-gradient(circle_at_40%_18%,#4fe2da_0%,#235d8d_36%,#102d52_100%)]",
      badges: ["Video", "PDF"],
      accentClassName: "bg-[#0f8a63]",
    },
    {
      mediaClassName: "bg-[radial-gradient(circle_at_72%_10%,#f4d08a_0%,#845628_28%,#27283c_100%)]",
      badges: ["PPT", "Video"],
      accentClassName: "bg-[#1f57f3]",
    },
    {
      mediaClassName: "bg-[radial-gradient(circle_at_55%_12%,#90d8f1_0%,#487594_34%,#243748_100%)]",
      badges: ["PDF", "PPT"],
      accentClassName: "bg-[#1f57f3]",
    },
    {
      mediaClassName: "bg-[radial-gradient(circle_at_65%_10%,#9ee5b6_0%,#305f47_38%,#183126_100%)]",
      badges: ["Video"],
      accentClassName: "bg-[#0f8a63]",
    },
  ] as const;

  return themes[index % themes.length];
}

function getProgressPercent(topic: StudentDashboardData["topics"][number], index: number) {
  const base = topic.materialCount * 20 + topic.exerciseCount * 12 + index * 9;
  return Math.min(Math.max(base, 0), 90);
}

function getButtonLabel(progressPercent: number) {
  if (progressPercent <= 0) {
    return "Lihat Topik";
  }

  if (progressPercent >= 90) {
    return "Buka Materi";
  }

  return "Lanjut Lihat";
}

export function PublicTopicCatalogView({ dashboardData }: PublicTopicCatalogViewProps) {
  const categories = [...new Set(dashboardData.topics.map((topic) => topic.category))].slice(0, 4);

  return (
    <PublicContentLayout homeHref="/" menus={buildHeaderMenus("/", "topics")}>
      <section className="rounded-[24px] border border-[#d8e2f3] bg-[#f5f8ff] px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
        <div className="max-w-[820px]">
          <h1 className="text-[42px] leading-[1.08] font-black tracking-tight text-[#1f2f46] lg:text-[58px]">
            Katalog Materi Belajar
          </h1>
          <p className="mt-4 max-w-[780px] text-[16px] leading-9 text-[#596983]">
            Lihat semua topik yang tersedia, cek materi preview, dan kenali latihan yang bisa dibuka setelah masuk akun.
          </p>
        </div>

        {dashboardData.topics.length > 0 ? (
          <div className="mt-8 grid gap-6 xl:grid-cols-[256px_minmax(0,1fr)]">
            <aside className="rounded-[22px] bg-[#eef3ff] px-6 py-6 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-3 text-[#1f57f3]">
                <Filter className="size-5" />
                <h2 className="text-[16px] font-black">Filter Materi</h2>
              </div>

              <div className="mt-8">
                <p className="text-[14px] font-bold text-[#1f2f46]">Jenjang</p>
                <div className="mt-4 space-y-4 border-t border-[#cad7f1] pt-4">
                  {["SD (Sekolah Dasar)", "SMP (Sekolah Menengah)"].map((label, index) => (
                    <label key={label} className="flex items-start gap-3 text-[14px] font-medium text-[#42516a]">
                      <span
                        className={cn(
                          "mt-0.5 flex size-7 items-center justify-center rounded-[8px] border",
                          index === 0
                            ? "border-[#1f57f3] bg-white text-[#1f57f3]"
                            : "border-[#8d99ad] bg-[#eef3ff] text-transparent",
                        )}
                      >
                        <Check className="size-4" />
                      </span>
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[14px] font-bold text-[#1f2f46]">Mata Pelajaran</p>
                <div className="mt-4 border-t border-[#cad7f1] pt-4">
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div
                        key={category}
                        className={cn(
                          "flex h-[42px] items-center rounded-full px-5 text-[14px] font-bold",
                          index === 0 ? "bg-[#1f57f3] text-white" : "bg-[#dbe6fb] text-[#42516a]",
                        )}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="grid gap-6 md:grid-cols-2">
              {dashboardData.topics.map((topic, index) => {
                const isPreview = topic.accessLevel === "PREVIEW";
                const theme = getTopicCardTheme(index);
                const progressPercent = getProgressPercent(topic, index);

                return (
                  <article
                    id={topic.slug}
                    key={topic.slug}
                    className="overflow-hidden rounded-[20px] bg-white shadow-[0_18px_36px_-32px_rgba(15,23,42,0.45)]"
                  >
                    <div className={cn("relative h-[196px] overflow-hidden", theme.mediaClassName)}>
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(15,23,42,0.18))]" />
                      <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2">
                        {theme.badges.map((badge) => (
                          <span
                            key={badge}
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-4 py-2 text-[12px] font-bold text-white",
                              badge === "PDF"
                                ? "bg-[#138655]"
                                : badge === "PPT"
                                  ? "bg-[#8b5a00]"
                                  : "bg-[#1f57f3]",
                            )}
                          >
                            {badge === "PDF" ? (
                              <BookOpen className="size-3.5" />
                            ) : badge === "PPT" ? (
                              <Presentation className="size-3.5" />
                            ) : (
                              <PlayCircle className="size-3.5" />
                            )}
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="px-6 py-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-[20px] font-medium text-[#1f2f46]">{topic.title}</h2>
                          <p className="mt-2 text-[14px] text-[#596983]">
                            {topic.materialCount} materi • {topic.exerciseCount} latihan • {getTopicLevel(topic.category)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-[11px] font-bold",
                            isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                          )}
                        >
                          {isPreview ? "Preview" : "Premium"}
                        </span>
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center justify-between gap-3 text-[16px] font-medium text-[#42516a]">
                          <span>Ringkasan Topik</span>
                          <span className="font-black text-[#1f57f3]">{progressPercent}%</span>
                        </div>
                        <div className="mt-2 h-[12px] rounded-full bg-[#e3ecfb]">
                          <div
                            className={cn("h-full rounded-full", theme.accentClassName)}
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 rounded-[16px] bg-[#f8fbff] px-4 py-3 text-[13px] font-medium text-[#596983]">
                        <div className="flex items-center gap-2">
                          <Lock className="size-4" />
                          {isPreview
                            ? "Ada materi preview yang bisa dilihat lebih dulu."
                            : "Topik ini tersedia penuh untuk akun premium."}
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Link
                          href={`/topik/${topic.slug}`}
                          className="flex h-[48px] flex-1 items-center justify-center rounded-[12px] border border-[#dbe6fb] bg-white text-[15px] font-bold text-[#1f57f3]"
                        >
                          Detail Topik
                        </Link>
                        <Link
                          href="/masuk"
                          className="flex h-[48px] flex-1 items-center justify-center rounded-[12px] bg-[#1f57f3] text-[15px] font-bold text-white shadow-[0_18px_28px_-24px_rgba(31,87,243,0.95)]"
                        >
                          {getButtonLabel(progressPercent)}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[20px] border border-dashed border-[#d8e2f3] bg-white px-6 py-8 text-[15px] leading-8 text-[#596983]">
            Belum ada topik yang dipublish dari database. Setelah admin menambahkan topik aktif, katalog materi akan
            tampil di halaman ini.
          </div>
        )}
      </section>
    </PublicContentLayout>
  );
}
