import Link from "next/link";
import { BookOpen, ClipboardCheck, GraduationCap, Star, Trophy } from "lucide-react";

import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import { buildSidebarMenus } from "@/components/student-dashboard/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardRecentActivity, StudentDashboardData } from "@/lib/student-dashboard";
import { cn } from "@/lib/utils";

type StudentHomeDashboardProps = {
  displayName: string;
  dashboardData: StudentDashboardData;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

type ProgressItem = {
  title: string;
  subtitle: string;
  badge: string;
  progress: number;
  accent: "blue" | "green";
  href: string;
};

type RecommendationCard = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  accent: "blue" | "green";
};

function clampProgressFromWidth(width: string) {
  const numeric = Number.parseInt(width.replace("%", ""), 10);
  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.min(Math.max(numeric, 0), 100);
}

function formatRelativeTime(value: string) {
  const target = new Date(value).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const diffMinutes = Math.round(diffMs / 60000);

  const formatter = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) {
    return formatter.format(diffMinutes, "minute");
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) {
    return formatter.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return formatter.format(diffDays, "day");
}

function createProgressItems(data: StudentDashboardData): ProgressItem[] {
  return data.favoriteTopics.slice(0, 3).map((topic, index) => ({
    title: topic.title,
    subtitle: `${topic.materialCount} materi • ${topic.exerciseCount} latihan tersedia`,
    badge: topic.category,
    progress: clampProgressFromWidth(topic.progressWidth),
    accent: index === 0 ? "blue" : "green",
    href: `/siswa/topik/${topic.slug}`,
  }));
}

function createRecommendationCards(data: StudentDashboardData): RecommendationCard[] {
  const topicRecommendations = data.favoriteTopics.slice(0, 2).map((topic, index) => ({
    title: index === 0 ? `Lanjutkan topik ${topic.title}` : `Perdalam ${topic.title}`,
    description: `Topik ini punya ${topic.materialCount} materi dan ${topic.exerciseCount} latihan yang siap kamu lanjutkan.`,
    buttonLabel: index === 0 ? "Buka Topik" : "Mulai Belajar",
    href: `/siswa/topik/${topic.slug}`,
    accent: index === 0 ? "blue" as const : "green" as const,
  }));

  if (topicRecommendations.length > 0) {
    return topicRecommendations;
  }

  return data.features.slice(0, 2).map((feature, index) => ({
    title: feature.kind === "material" ? `Coba materi ${feature.title}` : `Kerjakan latihan ${feature.title}`,
    description: feature.description,
    buttonLabel: feature.kind === "material" ? "Lihat Materi" : "Buka Latihan",
    href: feature.href,
    accent: index === 0 ? "blue" as const : "green" as const,
  }));
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  helper: string;
  icon: typeof Star;
  accent: "blue" | "green" | "amber";
}) {
  return (
    <Card
      className={cn(
        "rounded-[18px] border bg-white py-0 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.35)]",
        accent === "blue" && "border-l-[4px] border-l-[#2563eb] border-[#dce5f4]",
        accent === "green" && "border-l-[4px] border-l-[#0f8a63] border-[#dce5f4]",
        accent === "amber" && "border-l-[4px] border-l-[#b7791f] border-[#dce5f4]",
      )}
    >
      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-[12px]",
            accent === "blue" && "bg-[#e9efff] text-[#2563eb]",
            accent === "green" && "bg-[#e7f8f1] text-[#0f8a63]",
            accent === "amber" && "bg-[#fff3df] text-[#b7791f]",
          )}
        >
          <Icon className="size-5" />
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#73829b]">{label}</p>
          <p
            className={cn(
              "mt-1 text-[18px] font-black",
              accent === "blue" && "text-[#2563eb]",
              accent === "green" && "text-[#0f8a63]",
              accent === "amber" && "text-[#9a6700]",
            )}
          >
            {value}
          </p>
          <p className="mt-1 text-[12px] text-[#73829b]">{helper}</p>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}

function ActivityItemCard({ item }: { item: DashboardRecentActivity }) {
  return (
    <Link href={item.href} className="flex gap-3 rounded-[14px] px-1 py-1 transition hover:bg-[#f8fbff]">
      <span
        className={cn(
          "mt-2 size-2.5 shrink-0 rounded-full",
          item.accent === "blue" && "bg-[#2563eb]",
          item.accent === "green" && "bg-[#0f8a63]",
          item.accent === "amber" && "bg-[#b7791f]",
        )}
      />
      <div>
        <p className="text-[14px] font-bold text-[#1f2f46]">{item.title}</p>
        <p className="mt-1 text-[12px] text-[#5f6d83]">{item.meta}</p>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#97a4ba]">
          {formatRelativeTime(item.happenedAt)}
        </p>
      </div>
    </Link>
  );
}

export function StudentHomeDashboard({
  displayName,
  dashboardData,
  logoutAction,
}: StudentHomeDashboardProps) {
  const progressItems = createProgressItems(dashboardData);
  const recommendationCards = createRecommendationCards(dashboardData);

  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={buildSidebarMenus("/siswa", "dashboard")}
      logoutAction={logoutAction}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <h1 className="text-[28px] font-black tracking-tight text-[#1f2f46]">Halo, {displayName}!</h1>
        <p className="mt-2 text-[16px] text-[#5f6d83]">
          Dashboard ini sekarang menampilkan ringkasan belajar dari data yang benar-benar tersedia.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <StatCard
            label="Rata-rata Latihan"
            value={dashboardData.stats.averageScore !== null ? `${dashboardData.stats.averageScore}%` : "-"}
            helper={`${dashboardData.stats.attemptCount} attempt tercatat`}
            icon={Star}
            accent="blue"
          />
          <StatCard
            label="Materi Tersedia"
            value={String(dashboardData.stats.materialCount)}
            helper={`${dashboardData.stats.topicCount} topik aktif`}
            icon={BookOpen}
            accent="green"
          />
          <StatCard
            label="Latihan Tersedia"
            value={String(dashboardData.stats.exerciseCount)}
            helper={`${dashboardData.stats.categoryCount} kategori aktif`}
            icon={Trophy}
            accent="amber"
          />
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[22px] bg-transparent">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[20px] font-black text-[#1f2f46]">Progres Belajar</h2>
              <Button
                render={<Link href="/siswa/topik" />}
                nativeButton={false}
                variant="link"
                className="h-auto px-0 text-[14px] font-bold text-[#2563eb]"
              >
                Lihat Semua
              </Button>
            </div>

            {progressItems.length > 0 ? (
              <div className="mt-3 space-y-4">
                {progressItems.map((item) => (
                  <Card
                    key={item.title}
                    className={cn(
                      "rounded-[18px] border bg-white py-0 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.35)]",
                      item.accent === "blue"
                        ? "border-t-[3px] border-t-[#2563eb] border-[#dce5f4]"
                        : "border-t-[3px] border-t-[#0f8a63] border-[#dce5f4]",
                    )}
                  >
                    <CardContent className="px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[15px] font-bold text-[#1f2f46]">{item.title}</p>
                        <p className="mt-1 text-[12px] text-[#73829b]">{item.subtitle}</p>
                      </div>
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-[12px] font-bold",
                          item.accent === "blue"
                            ? "bg-[#ecefff] text-[#4752a7]"
                            : "bg-[#dff8ee] text-[#0f8a63]",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    </div>

                    <div className="mt-4 h-[7px] rounded-full bg-[#e4ebf7]">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          item.accent === "blue" ? "bg-[#2563eb]" : "bg-[#0f8a63]",
                        )}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p
                        className={cn(
                          "text-[13px] font-bold",
                          item.accent === "blue" ? "text-[#2563eb]" : "text-[#0f8a63]",
                        )}
                        >
                          {item.progress}% kepadatan konten
                        </p>
                      <Button
                        render={<Link href={item.href} />}
                        nativeButton={false}
                        className={cn(
                          "h-[38px] rounded-[10px] px-5 text-[14px] font-bold text-white",
                          item.accent === "blue"
                            ? "bg-[#2563eb] hover:bg-[#1f58da]"
                            : "bg-[#0f8a63] hover:bg-[#0b6f50]",
                        )}
                      >
                        Lanjutkan
                      </Button>
                    </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mt-3 rounded-[18px] border-dashed border-[#dce5f4] bg-white py-0">
                <CardContent className="px-5 py-6 text-[14px] leading-7 text-[#73829b]">
                Belum ada topik aktif yang bisa ditampilkan di dashboard.
                </CardContent>
              </Card>
            )}
          </section>

          <Card className="rounded-[18px] border-[#dce5f4] bg-white py-0 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.35)]">
            <CardContent className="px-4 py-4">
            <h2 className="text-[20px] font-black text-[#1f2f46]">Aktivitas Terakhir</h2>

            {dashboardData.recentActivities.length > 0 ? (
              <div className="mt-5 space-y-4">
                {dashboardData.recentActivities.map((item) => (
                  <ActivityItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[14px] bg-[#f8fbff] px-4 py-4 text-[13px] leading-6 text-[#73829b]">
                Belum ada riwayat latihan dari akun ini.
              </div>
            )}

            <Button
              render={<Link href="/siswa/latihan" />}
              nativeButton={false}
              variant="outline"
              size="lg"
              className="mt-6 h-[42px] w-full rounded-[12px] border-[#cfd8ea] text-[14px] font-semibold text-[#43536d] hover:bg-[#f7f9ff]"
            >
              Buka Semua Latihan
            </Button>
            </CardContent>
          </Card>
        </div>

        <section className="mt-8">
          <h2 className="text-[20px] font-black text-[#1f2f46]">Rekomendasi Untukmu</h2>
          <p className="mt-1 text-[13px] text-[#73829b]">
            Rekomendasi ini diambil dari topik dan konten yang benar-benar tersedia di sistem.
          </p>

          {recommendationCards.length > 0 ? (
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {recommendationCards.map((card) => (
                <Card
                  key={card.title}
                  className="rounded-[20px] border border-[#dce5f4] bg-[#eaf1ff] py-0 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.3)]"
                >
                  <CardContent className="px-5 py-5">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full bg-white",
                      card.accent === "blue" ? "text-[#2563eb]" : "text-[#0f8a63]",
                    )}
                  >
                    {card.accent === "blue" ? (
                      <GraduationCap className="size-5" />
                    ) : (
                      <ClipboardCheck className="size-5" />
                    )}
                  </div>
                  <p className="mt-6 text-[18px] font-bold text-[#1f2f46]">{card.title}</p>
                  <p className="mt-3 text-[13px] leading-6 text-[#596983]">{card.description}</p>
                  <Button
                    render={<Link href={card.href} />}
                    nativeButton={false}
                    className={cn(
                      "mt-6 h-[40px] rounded-full px-6 text-[14px] font-bold text-white",
                      card.accent === "blue"
                        ? "bg-[#2563eb] hover:bg-[#1f58da]"
                        : "bg-[#0f8a63] hover:bg-[#0b6f50]",
                    )}
                  >
                    {card.buttonLabel}
                  </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mt-4 rounded-[18px] border-dashed border-[#dce5f4] bg-white py-0">
              <CardContent className="px-5 py-6 text-[14px] leading-7 text-[#73829b]">
              Rekomendasi akan muncul setelah sistem menemukan topik atau latihan yang relevan.
              </CardContent>
            </Card>
          )}
        </section>
      </section>
    </StudentAppLayout>
  );
}
