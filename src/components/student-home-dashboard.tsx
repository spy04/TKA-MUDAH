import Link from "next/link";
import { ClipboardCheck, GraduationCap, Star, Trophy } from "lucide-react";

import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import type { SidebarItem } from "@/components/student-dashboard/data";
import type { StudentDashboardData } from "@/lib/student-dashboard";
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

type ActivityItem = {
  title: string;
  meta: string;
  caption: string;
  accent: "blue" | "green" | "amber";
};

const sidebarMenus: SidebarItem[] = [
  { label: "Home", href: "/siswa", icon: GraduationCap, active: true },
  { label: "Materi Saya", href: "/siswa/topik", icon: GraduationCap, active: false },
  { label: "Tryout", href: "/siswa/latihan", icon: ClipboardCheck, active: false },
  { label: "Statistik", href: "#statistik", icon: Star, active: false },
  { label: "Pengaturan", href: "#pengaturan", icon: Trophy, active: false },
];

const statCards = [
  { label: "Skor Rata-rata", value: "88.5", icon: Star, accent: "blue" },
  { label: "Materi Selesai", value: "24/30", icon: ClipboardCheck, accent: "green" },
  { label: "Peringkat Sekolah", value: "12", icon: Trophy, accent: "amber" },
] as const;

function clampProgressFromWidth(width: string) {
  const numeric = Number.parseInt(width.replace("%", ""), 10);
  if (Number.isNaN(numeric)) {
    return 42;
  }

  return Math.min(Math.max(numeric, 8), 100);
}

function createProgressItems(data: StudentDashboardData): ProgressItem[] {
  const fromFavoriteTopics = data.favoriteTopics.slice(0, 2).map((topic, index) => ({
    title: topic.title,
    subtitle: `Modul ${Math.max(topic.materialCount, 1)} • ${Math.max(topic.exerciseCount, 1)} latihan`,
    badge: topic.category,
    progress: clampProgressFromWidth(topic.progressWidth),
    accent: index === 0 ? "blue" as const : "green" as const,
    href: `/siswa/topik/${topic.slug}`,
  }));

  if (fromFavoriteTopics.length > 0) {
    return fromFavoriteTopics;
  }

  return [
    {
      title: "Matematika Dasar: Pecahan",
      subtitle: "Modul 4 • Video belum ditonton",
      badge: "Eksak",
      progress: 75,
      accent: "blue",
      href: "/siswa/topik",
    },
    {
      title: "Bahasa Indonesia: Ide Pokok",
      subtitle: "Modul 2 • 5 latihan soal",
      badge: "Literasi",
      progress: 40,
      accent: "green",
      href: "/siswa/topik",
    },
  ];
}

function createActivityItems(data: StudentDashboardData): ActivityItem[] {
  const topicItems = data.topics.slice(0, 3).map((topic, index) => ({
    title:
      index === 0
        ? `Selesai latihan ${topic.title}`
        : index === 1
          ? `Mengikuti simulasi ${topic.title}`
          : `Menonton materi ${topic.title}`,
    meta:
      index === 0
        ? `Skor: ${Math.min(100, 70 + topic.exerciseCount * 5)}/100`
        : index === 1
          ? "Status: Menunggu hasil"
          : `Durasi: ${Math.max(10, topic.materialCount * 12)} menit`,
    caption:
      index === 0
        ? "2 jam yang lalu"
        : index === 1
          ? "Kemarin"
          : "3 hari yang lalu",
    accent: index === 0 ? "blue" as const : index === 1 ? "green" as const : "amber" as const,
  }));

  if (topicItems.length > 0) {
    return topicItems;
  }

  return [
    {
      title: "Selesai latihan pecahan",
      meta: "Skor: 90/100",
      caption: "2 jam yang lalu",
      accent: "blue",
    },
    {
      title: "Mengikuti simulasi TKA 1",
      meta: "Status: Menunggu hasil",
      caption: "Kemarin",
      accent: "green",
    },
    {
      title: "Menonton video logika",
      meta: "Durasi: 15 menit",
      caption: "3 hari yang lalu",
      accent: "amber",
    },
  ];
}

function createRecommendationCards(data: StudentDashboardData) {
  const firstTopic = data.topics[0];
  const secondTopic = data.topics[1];

  return [
    {
      title: firstTopic ? `Pelajari lagi: ${firstTopic.title}` : "Pelajari lagi: Perbandingan",
      description: firstTopic
        ? `Fokuskan ulang ${firstTopic.category.toLowerCase()} supaya progresmu makin stabil minggu ini.`
        : "Skormu di topik ini masih di bawah rata-rata. Yuk perkuat pemahamanmu.",
      buttonLabel: "Mulai Belajar",
      href: firstTopic ? `/siswa/topik/${firstTopic.slug}` : "/siswa/topik",
      accent: "blue",
    },
    {
      title: secondTopic ? `Latihan: ${secondTopic.title}` : "Latihan: Struktur Kalimat",
      description: secondTopic
        ? `Coba sesi latihan singkat untuk ${secondTopic.title.toLowerCase()} biar ritme belajarmu tetap terjaga.`
        : "Kamu sering melewatkan soal jenis ini. Coba 10 soal latihan kilat.",
      buttonLabel: "Coba Latihan",
      href: secondTopic ? `/siswa/topik/${secondTopic.slug}` : "/siswa/latihan",
      accent: "green",
    },
  ] as const;
}

export function StudentHomeDashboard({
  displayName,
  dashboardData,
  logoutAction,
}: StudentHomeDashboardProps) {
  const progressItems = createProgressItems(dashboardData);
  const activityItems = createActivityItems(dashboardData);
  const recommendationCards = createRecommendationCards(dashboardData);

  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={sidebarMenus}
      logoutAction={logoutAction}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <h1 className="text-[28px] font-black tracking-tight text-[#1f2f46]">
          Halo, {displayName}! <span className="inline-block">👋</span>
        </h1>
        <p className="mt-2 text-[16px] text-[#5f6d83]">
          Siap belajar hari ini? Mari kita lanjutkan petualangan belajarmu!
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className={cn(
                "rounded-[18px] border bg-white px-5 py-4 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.35)]",
                accent === "blue" && "border-l-[4px] border-l-[#2563eb] border-[#dce5f4]",
                accent === "green" && "border-l-[4px] border-l-[#0f8a63] border-[#dce5f4]",
                accent === "amber" && "border-l-[4px] border-l-[#b7791f] border-[#dce5f4]",
              )}
            >
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
                  <p className="text-[11px] font-bold tracking-[0.12em] text-[#73829b] uppercase">
                    {label}
                  </p>
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
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-[22px] bg-transparent">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[20px] font-black text-[#1f2f46]">Progres Belajar</h2>
              <Link href="/siswa/topik" className="text-[14px] font-bold text-[#2563eb]">
                Lihat Semua
              </Link>
            </div>

            <div className="mt-3 space-y-4">
              {progressItems.map((item) => (
                <div
                  key={item.title}
                  className={cn(
                    "rounded-[18px] border bg-white px-4 py-4 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.35)]",
                    item.accent === "blue" ? "border-t-[3px] border-t-[#2563eb] border-[#dce5f4]" : "border-t-[3px] border-t-[#0f8a63] border-[#dce5f4]",
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-bold text-[#1f2f46]">{item.title}</p>
                      <p className="mt-1 text-[12px] text-[#73829b]">{item.subtitle}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-[12px] font-bold",
                        item.accent === "blue" ? "bg-[#ecefff] text-[#4752a7]" : "bg-[#dff8ee] text-[#0f8a63]",
                      )}
                    >
                      {item.badge}
                    </span>
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
                      {item.progress}% Selesai
                    </p>
                    <Link
                      href={item.href}
                      className={cn(
                        "inline-flex h-[38px] items-center justify-center rounded-[10px] px-5 text-[14px] font-bold text-white",
                        item.accent === "blue" ? "bg-[#2563eb]" : "bg-[#0f8a63]",
                      )}
                    >
                      Lanjutkan
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[18px] border border-[#dce5f4] bg-white px-4 py-4 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.35)]">
            <h2 className="text-[20px] font-black text-[#1f2f46]">Aktivitas Terakhir</h2>

            <div className="mt-5 space-y-5">
              {activityItems.map((item) => (
                <div key={item.title} className="flex gap-3">
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
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/siswa/latihan"
              className="mt-6 inline-flex h-[42px] w-full items-center justify-center rounded-[12px] border border-[#cfd8ea] text-[14px] font-semibold text-[#43536d] transition hover:bg-[#f7f9ff]"
            >
              Riwayat Lengkap
            </Link>
          </aside>
        </div>

        <section className="mt-8">
          <h2 className="text-[20px] font-black text-[#1f2f46]">Rekomendasi Untukmu</h2>
          <p className="mt-1 text-[13px] text-[#73829b]">
            Berdasarkan progres belajar dan topik yang paling sering kamu buka.
          </p>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px]">
            {recommendationCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[20px] border border-[#dce5f4] bg-[#eaf1ff] px-5 py-5 shadow-[0_16px_24px_-24px_rgba(15,23,42,0.3)]"
              >
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
                <Link
                  href={card.href}
                  className={cn(
                    "mt-6 inline-flex h-[40px] items-center justify-center rounded-full px-6 text-[14px] font-bold text-white",
                    card.accent === "blue" ? "bg-[#2563eb]" : "bg-[#0f8a63]",
                  )}
                >
                  {card.buttonLabel}
                </Link>
              </div>
            ))}

            <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#1c4ed8_0%,#1737af_100%)] px-5 py-5 text-white shadow-[0_20px_30px_-24px_rgba(23,55,175,0.92)]">
              <div className="absolute -right-8 top-5 h-28 w-28 rounded-full bg-white/10 blur-xl" />
              <div className="absolute bottom-4 left-4 h-20 w-20 rounded-full bg-white/8 blur-lg" />
              <p className="relative z-10 text-[18px] font-bold">Grup Belajar</p>
              <p className="relative z-10 mt-3 text-[13px] leading-6 text-white/84">
                Belajar bareng teman-teman Indonesia biar makin seru dan terarah.
              </p>
              <div className="relative z-10 mt-8 flex -space-x-3">
                {["S", "N", "A"].map((label, index) => (
                  <span
                    key={label}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full border-2 border-[#1c4ed8] text-[16px] font-black",
                      index === 0 && "bg-[#6478ff]",
                      index === 1 && "bg-[#8b5cf6]",
                      index === 2 && "bg-[#0ea5a7]",
                    )}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </StudentAppLayout>
  );
}
