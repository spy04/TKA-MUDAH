import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BookOpenCheck,
  ClipboardCheck,
  FileText,
  GraduationCap,
  House,
  Image,
  Languages,
  Mail,
  MapPin,
  MonitorPlay,
  Phone,
  PlaySquare,
  Search,
  Settings,
  Timer,
  Trophy,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  active: boolean;
};

type DashboardSection = "dashboard" | "topics" | "exercises" | "simulation";

export type SidebarItem = NavItem & {
  icon: LucideIcon;
};

export type SchoolLevel = {
  title: string;
  description: string;
  textClassName: string;
  lineClassName: string;
  icon: LucideIcon;
};

export type SubjectCard = {
  title: string;
  icon: LucideIcon;
  iconClassName: string;
  barClassName: string;
  buttonClassName: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  cardClassName: string;
  iconClassName: string;
};

export type SocialLink = {
  label: string;
  icon: LucideIcon;
};

export const schoolLevels: SchoolLevel[] = [
  {
    title: "SD",
    description: "Modul & Latihan untuk Kelas 4, 5, 6",
    textClassName: "text-[#2563eb]",
    lineClassName: "bg-[#2563eb]",
    icon: GraduationCap,
  },
  {
    title: "SMP",
    description: "Materi & Simulasi untuk Kelas 7, 8, 9",
    textClassName: "text-[#0f8a63]",
    lineClassName: "bg-[#0f8a63]",
    icon: BookOpenCheck,
  },
];

export const subjectCards: SubjectCard[] = [
  {
    title: "Matematika",
    icon: FileText,
    iconClassName: "bg-[#eef4ff] text-[#2563eb]",
    barClassName: "bg-[#2563eb]",
    buttonClassName: "bg-[#e8f0ff] text-[#2563eb]",
  },
  {
    title: "Bahasa Indonesia",
    icon: Languages,
    iconClassName: "bg-[#edf8f2] text-[#0f8a63]",
    barClassName: "bg-[#0f8a63]",
    buttonClassName: "bg-[#edf8f2] text-[#0f8a63]",
  },
];

export const featureCards: FeatureCard[] = [
  {
    title: "Modul PDF",
    description: "Materi disusun sistematis untuk memudahkan pemahaman.",
    icon: FileText,
    cardClassName: "bg-white text-[#1f2f46]",
    iconClassName: "bg-[#eef4ff] text-[#2563eb]",
  },
  {
    title: "Video Pembelajaran",
    description: "Penjelasan visual yang seru dan mudah dimengerti.",
    icon: MonitorPlay,
    cardClassName: "bg-[#1f57f3] text-white",
    iconClassName: "bg-white/10 text-white",
  },
  {
    title: "PPT Materi",
    description: "Ringkasan materi dalam bentuk slide yang menarik.",
    icon: PlaySquare,
    cardClassName: "bg-white text-[#1f2f46]",
    iconClassName: "bg-[#eef4ff] text-[#2563eb]",
  },
  {
    title: "Latihan Soal",
    description: "Ribuan bank soal dengan pembahasan lengkap.",
    icon: ClipboardCheck,
    cardClassName: "bg-white text-[#1f2f46]",
    iconClassName: "bg-[#eef4ff] text-[#2563eb]",
  },
  {
    title: "Simulasi TKA",
    description: "Uji kemampuanmu dengan batasan waktu nyata.",
    icon: Timer,
    cardClassName: "bg-[#0f8a63] text-white",
    iconClassName: "bg-white/10 text-white",
  },
  {
    title: "Tryout Nasional",
    description: "Bandingkan skormu dengan siswa seluruh Indonesia.",
    icon: Trophy,
    cardClassName: "bg-white text-[#1f2f46]",
    iconClassName: "bg-[#eef4ff] text-[#2563eb]",
  },
];

export const footerLinks = [
  "Tentang Kami",
  "Materi",
  "Latihan Soal",
  "Simulasi",
  "Tryout",
] as const;

export const socialLinks: SocialLink[] = [
  { label: "@tkamudah", icon: Image },
  { label: "@tkamudah", icon: PlaySquare },
  { label: "@tkamudah", icon: Search },
];

export function buildHeaderMenus(
  homeHref: string,
  currentSection: DashboardSection = "dashboard",
  exerciseHref?: string,
): NavItem[] {
  const topicHref = homeHref === "/siswa" ? "/siswa/topik" : "/topik";
  const resolvedExerciseHref = exerciseHref ?? (homeHref === "/siswa" ? "/siswa/latihan" : "/latihan");

  return [
    { label: "Dashboard", href: homeHref, active: currentSection === "dashboard" },
    { label: "Materi", href: topicHref, active: currentSection === "topics" },
    { label: "Latihan", href: resolvedExerciseHref, active: currentSection === "exercises" },
    { label: "Simulasi", href: "#simulasi", active: currentSection === "simulation" },
  ];
}

export function buildSidebarMenus(homeHref: string, currentSection: DashboardSection = "dashboard"): SidebarItem[] {
  const topicHref = homeHref === "/siswa" ? "/siswa/topik" : "/topik";

  return [
    { label: "Home", href: homeHref, icon: House, active: currentSection === "dashboard" },
    { label: "Materi Saya", href: topicHref, icon: BookOpen, active: currentSection === "topics" },
    { label: "Tryout", href: "#simulasi", icon: ClipboardCheck, active: false },
    { label: "Statistik", href: "#statistik", icon: FileText, active: false },
    { label: "Pengaturan", href: "#pengaturan", icon: Settings, active: false },
  ];
}

export const contactItems = [
  { label: "support@tkamudah.id", icon: Mail },
  { label: "+62 888-1943-987", icon: Phone },
  { label: "Jakarta, Indonesia", icon: MapPin },
] as const;
