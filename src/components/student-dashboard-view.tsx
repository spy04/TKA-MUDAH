import Link from "next/link";
import { ClipboardCheck, FileText } from "lucide-react";

import {
  buildHeaderMenus,
  buildSidebarMenus,
  featureCards,
  schoolLevels,
} from "@/components/student-dashboard/data";
import { StudentFooter } from "@/components/student-dashboard/student-footer";
import { StudentNavbar } from "@/components/student-dashboard/student-navbar";
import { StudentSidebar } from "@/components/student-dashboard/student-sidebar";
import type { StudentDashboardData } from "@/lib/student-dashboard";
import { cn } from "@/lib/utils";

type StudentDashboardViewProps = {
  displayName: string;
  homeHref: string;
  dashboardData: StudentDashboardData;
  isEnrolled?: boolean;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentDashboardView({
  displayName,
  homeHref,
  dashboardData,
  isEnrolled = false,
  logoutAction,
}: StudentDashboardViewProps) {
  const avatarText = displayName.charAt(0).toUpperCase();
  const headerMenus = buildHeaderMenus(homeHref);
  const sidebarMenus = buildSidebarMenus(homeHref);
  const topicHref = isEnrolled ? "/siswa/topik" : "/topik";
  const topicDetailBaseHref = isEnrolled ? "/siswa/topik" : "/topik";
  const exerciseHref = isEnrolled ? "/siswa/latihan" : "/latihan";

  return (
    <main className="min-h-screen bg-[#eaf1ff] text-[#1f2f46]">
      <div className="min-h-screen">
        <StudentNavbar
          avatarText={avatarText}
          homeHref={homeHref}
          menus={headerMenus}
          isAuthenticated={isEnrolled}
        />

        <div className="bg-[#f5f8ff]">
          <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 lg:px-6">
            <div className="hidden self-start pt-2 lg:sticky lg:top-[84px] lg:block">
              <StudentSidebar displayName={displayName} menus={sidebarMenus} logoutAction={logoutAction} />
            </div>

            <div className="min-w-0 flex-1">
              <section className="grid gap-10 xl:grid-cols-[1fr_315px] xl:items-center">
                <div className="pl-0 xl:pl-3">
                  <div className="inline-flex rounded-full bg-[#dfe9ff] px-4 py-2 text-[12px] font-bold text-[#2563eb]">
                    #1 Platform Persiapan TKA
                  </div>

                  <h1 className="mt-7 max-w-[420px] text-[44px] leading-[1.1] font-black tracking-tight text-[#1f2f46]">
                    Belajar TKA Jadi
                    <br />
                    Lebih <span className="text-[#2563eb]">Mudah</span>
                  </h1>

                  <p className="mt-5 max-w-[470px] text-[16px] leading-9 text-[#596983]">
                    Platform lengkap dengan modul, video, latihan
                    soal, dan simulasi TKA untuk siswa SD & SMP.
                    Didesain khusus untuk membantu kamu meraih
                    hasil terbaik.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href={isEnrolled ? topicHref : "/daftar"}
                      className="flex h-[44px] items-center justify-center rounded-[12px] bg-[#2563eb] px-8 text-[14px] font-bold text-white shadow-[0_20px_28px_-24px_rgba(37,99,235,0.9)]"
                    >
                      {isEnrolled ? "Lanjut Belajar" : "Daftar Sekarang"}
                    </Link>
                    <Link
                      href={isEnrolled ? exerciseHref : "/masuk"}
                      className="flex h-[44px] items-center justify-center rounded-[12px] border-2 border-[#2563eb] px-8 text-[14px] font-bold text-[#2563eb]"
                    >
                      {isEnrolled ? "Coba Latihan" : "Sudah Punya Akun"}
                    </Link>
                  </div>
                </div>

                <div className="rounded-[18px] border-[3px] border-white bg-[radial-gradient(circle_at_top,#fff0b4_0%,#f9df89_18%,#345a56_62%,#24333d_100%)] p-3 shadow-[0_24px_34px_-24px_rgba(15,23,42,0.48)]">
                  <div className="relative overflow-hidden rounded-[16px] border border-white/20 px-4 pb-4 pt-4">
                    <div className="absolute left-1/2 top-5 h-44 w-44 -translate-x-1/2 rounded-full bg-[#fff4c9]" />
                    <div className="relative z-10 flex min-h-[240px] items-end justify-between gap-2">
                      <div className="mb-3 flex items-end gap-1.5">
                        <div className="h-12 w-9 rounded-t-sm bg-[#ca915d]" />
                        <div className="h-16 w-10 rounded-t-sm bg-[#b67d49]" />
                        <div className="h-20 w-11 rounded-t-sm bg-[#e0bb7a]" />
                      </div>

                      <div className="relative mb-1 flex flex-1 justify-center">
                        <div className="relative flex h-[176px] w-[132px] items-end justify-center rounded-[72px_72px_22px_22px] bg-gradient-to-b from-[#ffdcb9] via-[#ffc697] to-[#f2aa6f]">
                          <div className="absolute top-4 h-12 w-[72px] rounded-full bg-[#4e2d1d]" />
                          <div className="absolute top-[54px] h-[56px] w-[56px] rounded-full bg-[#ffd8b8]" />
                          <div className="absolute top-[87px] flex gap-5">
                            <span className="size-2 rounded-full bg-[#1f2f46]" />
                            <span className="size-2 rounded-full bg-[#1f2f46]" />
                          </div>
                          <div className="absolute top-[109px] h-2 w-8 rounded-full bg-[#da7047]" />
                          <div className="absolute bottom-0 h-[70px] w-[102px] rounded-t-[24px] bg-[#0ea5a7]" />
                        </div>
                      </div>

                      <div className="mb-2 rounded-[14px] bg-[#434959] px-4 py-6 shadow-xl">
                        <div className="space-y-2">
                          <div className="h-2 w-14 rounded-full bg-[#697286]" />
                          <div className="h-2 w-16 rounded-full bg-[#5d677b]" />
                          <div className="mt-3 h-14 w-20 rounded-lg bg-[#5a6275]" />
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 mt-2 h-3 rounded-full bg-[#6c4633]" />
                    <div className="relative z-10 mt-2 h-3 rounded-full bg-[#4d2f20]" />
                  </div>
                </div>
              </section>

              <section className="mt-8 w-full rounded-[4px] bg-white px-7 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)]">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-[24px] font-black tracking-tight text-[#1f2f46]">
                      Topic yang Bisa Dilihat Dulu
                    </h2>
                    <p className="mt-2 text-[14px] leading-7 text-[#596983]">
                      Orang yang belum daftar tetap bisa lihat daftar topic dan tahu mana yang preview atau enrolled.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#eef4ff] px-3 py-2 text-[12px] font-bold text-[#2563eb]">
                    {dashboardData.stats.topicCount} topic
                  </span>
                </div>

                {dashboardData.topics.length > 0 ? (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {dashboardData.topics.slice(0, 6).map((topic) => {
                      const isPreview = topic.accessLevel === "PREVIEW";

                      return (
                        <div
                          key={topic.slug}
                          className="rounded-[16px] border border-[#edf1f7] bg-white p-4 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[16px] font-bold text-[#1f2f46]">{topic.title}</p>
                              <p className="mt-1 text-[13px] text-[#596983]">{topic.category}</p>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-[11px] font-bold",
                                isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                              )}
                            >
                              {isPreview ? "Preview" : "Enrolled"}
                            </span>
                          </div>
                          <p className="mt-4 text-[13px] text-[#73829b]">
                            {topic.materialCount} materi • {topic.exerciseCount} latihan
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 rounded-[16px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-5 py-6 text-[14px] text-[#596983]">
                    Topik belum tersedia di database. Setelah topik dipublish dari admin, daftar preview akan muncul di sini.
                  </div>
                )}
              </section>

              <section className="mt-14 w-full rounded-[4px] bg-white px-7 py-8 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)]">
                <h2 className="text-[27px] font-black tracking-tight text-[#1f2f46]">
                  Pilih Jenjang Sekolah
                </h2>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                  {schoolLevels.map(({ title, description, textClassName, lineClassName, icon: Icon }) => (
                    <div
                      key={title}
                      className="overflow-hidden rounded-[16px] border border-[#edf1f7] bg-white shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]"
                    >
                      <div className="flex items-start justify-between px-5 py-6">
                        <div>
                          <p className={cn("text-[24px] font-medium", textClassName)}>{title}</p>
                          <p className="mt-2 text-[14px] text-[#596983]">{description}</p>
                        </div>
                        <Icon className="size-9 text-[#dce5f6]" />
                      </div>
                      <div className={cn("h-[3px] w-full", lineClassName)} />
                    </div>
                  ))}
                </div>

                <div id="materi" className="mt-10 flex items-end justify-between gap-4">
                  <h3 className="text-[27px] font-black tracking-tight text-[#1f2f46]">
                    Topik Favorit
                  </h3>
                  <Link href={topicHref} className="text-[14px] font-bold text-[#2563eb]">
                    Lihat Semua
                  </Link>
                </div>

                {dashboardData.favoriteTopics.length > 0 ? (
                  <div className="mt-5 grid max-w-[460px] gap-4 sm:grid-cols-2">
                    {dashboardData.favoriteTopics.map((topic, index) => {
                      const Icon = index === 0 ? FileText : ClipboardCheck;
                      const isPreview = topic.accessLevel === "PREVIEW";
                      const iconClassName = isPreview
                        ? "bg-[#eef4ff] text-[#2563eb]"
                        : "bg-[#edf8f2] text-[#0f8a63]";
                      const barClassName = isPreview ? "bg-[#2563eb]" : "bg-[#0f8a63]";
                      const buttonClassName = isPreview
                        ? "bg-[#e8f0ff] text-[#2563eb]"
                        : "bg-[#edf8f2] text-[#0f8a63]";

                      return (
                        <div
                          key={topic.slug}
                          className="rounded-[16px] border border-[#edf1f7] bg-white p-4 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]"
                        >
                          <div className={cn("flex size-11 items-center justify-center rounded-[12px]", iconClassName)}>
                            <Icon className="size-5" />
                          </div>
                          <div className="mt-4 flex items-center justify-between gap-2">
                            <p className="text-[15px] font-medium text-[#334155]">{topic.title}</p>
                            <span
                              className={cn(
                                "rounded-full px-2 py-1 text-[11px] font-bold",
                                isPreview ? "bg-[#e8f0ff] text-[#2563eb]" : "bg-[#edf8f2] text-[#0f8a63]",
                              )}
                            >
                              {isPreview ? "Preview" : "Enrolled"}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] font-medium text-[#73829b]">{topic.category}</p>
                          <p className="mt-2 text-[12px] text-[#73829b]">
                            {topic.materialCount} materi • {topic.exerciseCount} latihan
                          </p>
                          <div className="mt-3 h-[6px] rounded-full bg-[#edf2fb]">
                            <div
                              className={cn("h-full rounded-full", barClassName)}
                              style={{ width: topic.progressWidth }}
                            />
                          </div>
                          <Link
                            href={`${topicDetailBaseHref}/${topic.slug}`}
                            className={cn(
                              "mt-4 flex h-[40px] items-center justify-center rounded-[10px] text-[14px] font-bold",
                              buttonClassName,
                            )}
                          >
                            {isPreview ? "Lihat Preview" : "Lanjutkan"}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[16px] border border-dashed border-[#d8e2f3] bg-[#f8fbff] px-5 py-6 text-[14px] text-[#596983]">
                    Belum ada topik favorit yang bisa ditampilkan. Setelah materi atau latihan masuk, kartu favorit akan muncul dari data nyata.
                  </div>
                )}

                <div className="mt-10 text-center">
                  <h3 className="text-[27px] font-black tracking-tight text-[#1f2f46]">
                    Fitur Unggulan Kami
                  </h3>
                </div>

                <div id="simulasi" className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {featureCards.map((feature) => {
                    const Icon = feature.icon;

                    return (
                      <div
                        key={feature.title}
                        className={cn(
                          "min-h-[118px] rounded-[16px] border border-[#dde4f1] px-5 py-5 shadow-[0_16px_26px_-24px_rgba(15,23,42,0.35)]",
                          feature.cardClassName,
                        )}
                      >
                        <div className={cn("flex size-10 items-center justify-center rounded-[10px]", feature.iconClassName)}>
                          <Icon className="size-4" />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-2">
                          <p className="text-[15px] font-black">{feature.title}</p>
                        </div>
                        <p className="mt-2 max-w-[220px] text-[14px] leading-6 text-current/80">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <div className="min-h-[470px]" />
            </div>
          </div>
        </div>

        <StudentFooter />
      </div>
    </main>
  );
}
