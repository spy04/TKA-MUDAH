import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CirclePlay,
  Filter,
  GraduationCap,
  LayoutGrid,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const quickStats = [
  { label: "Materi aktif", value: "24", hint: "Video, ringkasan, dan latihan" },
  { label: "Quiz tersedia", value: "18", hint: "Campuran gratis dan gated" },
  { label: "Kategori", value: "6", hint: "TKA, numerasi, verbal, logika" },
];

const filters = ["Semua", "TKA", "Numerasi", "Verbal", "Logika", "Gratis", "Perlu login"];

const featuredCourses = [
  {
    title: "Dasar Numerasi TKA",
    description:
      "Mulai dari konsep hitung, pola angka, sampai latihan singkat yang mudah diikuti.",
    lessons: "12 lesson",
    duration: "2 jam 10 menit",
    access: "Gratis",
    accessVariant: "secondary" as const,
    level: "Pemula",
  },
  {
    title: "Strategi Verbal dan Bacaan",
    description:
      "Belajar memahami soal bacaan, sinonim, dan penalaran verbal dengan contoh bertahap.",
    lessons: "9 lesson",
    duration: "1 jam 40 menit",
    access: "Preview + login",
    accessVariant: "outline" as const,
    level: "Menengah",
  },
  {
    title: "Latihan Logika Campuran",
    description:
      "Kumpulan materi dan soal pola logika dengan pembahasan yang ringkas dan fokus.",
    lessons: "14 lesson",
    duration: "2 jam 35 menit",
    access: "Perlu login",
    accessVariant: "default" as const,
    level: "Menengah",
  },
];

const quizPacks = [
  {
    title: "Quiz Pemanasan TKA",
    items: "15 soal",
    mode: "Bisa langsung dikerjakan",
    access: "Gratis",
  },
  {
    title: "Quiz Evaluasi Numerasi",
    items: "20 soal",
    mode: "Nilai tersimpan setelah login",
    access: "Login untuk mulai",
  },
  {
    title: "Simulasi Mini Campuran",
    items: "30 soal",
    mode: "Progress dan ranking butuh akun",
    access: "Login untuk mulai",
  },
];

const steps = [
  {
    title: "Jelajahi materi",
    description: "Semua pengunjung bisa lihat katalog, kategori, dan detail materi.",
    icon: LayoutGrid,
  },
  {
    title: "Pilih akses belajar",
    description: "Konten diberi label jelas: gratis, preview, atau perlu login.",
    icon: Filter,
  },
  {
    title: "Lanjutkan progres",
    description: "Login dipakai hanya saat ingin menyimpan nilai, progress, atau riwayat.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-6">
        <section className="overflow-hidden rounded-[32px] border border-border/70 bg-card/95 shadow-sm">
          <div className="relative px-6 py-6 sm:px-8 sm:py-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-r from-primary/12 via-secondary/40 to-accent/18" />
            <div className="relative flex flex-col gap-8">
              <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                    <GraduationCap className="size-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">TKA Mudah</p>
                    <p className="text-sm text-muted-foreground">
                      Dashboard belajar publik bergaya katalog
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="size-3" />
                    Akses publik
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <LockKeyhole className="size-3" />
                    Quiz tertentu bisa digate
                  </Badge>
                </div>
              </header>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Badge variant="outline" className="gap-1 border-primary/20 bg-background/80">
                      <BookOpen className="size-3" />
                      Konsep awal ala Udemy
                    </Badge>
                    <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                      Semua orang bisa masuk, lalu pilih materi atau quiz sesuai aksesnya.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                      Halaman ini dibuat untuk eksplorasi publik. Pengguna bisa melihat
                      katalog, membaca ringkasan, dan mengenali konten gratis atau konten
                      yang nanti perlu login tanpa terasa membingungkan.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="#materi"
                      className={cn(buttonVariants({ size: "lg" }), "px-4")}
                    >
                      Lihat materi
                      <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      href="#quiz"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "px-4",
                      )}
                    >
                      Cek quiz
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {quickStats.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-border/70 bg-background/85 px-4 py-4"
                      >
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">
                          {item.value}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="border border-border/70 bg-background/90 shadow-sm">
                  <CardHeader className="border-b border-border/70">
                    <CardTitle className="flex items-center gap-2">
                      <Search className="size-4 text-primary" />
                      Filter yang mudah dipahami
                    </CardTitle>
                    <CardDescription>
                      Pengguna tidak perlu login dulu untuk memahami isi platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-5">
                    <div className="rounded-2xl border border-border/70 bg-muted/50 p-4">
                      <p className="text-sm font-medium text-foreground">Cari cepat</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Nanti bagian ini bisa dihubungkan ke pencarian mapel, kelas, atau
                        tipe konten.
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">Filter akses</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {filters.map((filter) => (
                          <Badge
                            key={filter}
                            variant={filter === "Semua" ? "secondary" : "outline"}
                            className="h-8 px-3 text-sm"
                          >
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
                          <Users className="size-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">Aturan akses yang jelas</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            Saran struktur data: setiap materi atau quiz punya label seperti
                            <span className="font-medium text-foreground"> gratis</span>,
                            <span className="font-medium text-foreground"> preview</span>,
                            atau
                            <span className="font-medium text-foreground"> perlu login</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="materi" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">Materi unggulan</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Katalog materi yang bisa dijelajahi siapa saja
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              Detail materi tetap tampil terbuka supaya pengguna bisa menilai sebelum
              memutuskan lanjut belajar.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {featuredCourses.map((course) => (
              <Card
                key={course.title}
                className="border border-border/70 bg-card/95 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <CardHeader className="space-y-3 border-b border-border/70">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={course.accessVariant}>{course.access}</Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {course.level}
                    </span>
                  </div>
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="mt-2 leading-6">
                      {course.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/60 px-3 py-3">
                      <p className="text-xs text-muted-foreground">Isi</p>
                      <p className="mt-1 font-medium text-foreground">{course.lessons}</p>
                    </div>
                    <div className="rounded-2xl bg-muted/60 px-3 py-3">
                      <p className="text-xs text-muted-foreground">Durasi</p>
                      <p className="mt-1 font-medium text-foreground">{course.duration}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Ringkasan bisa dibuka</span>
                  <Link href="/" className={cn(buttonVariants({ variant: "ghost" }))}>
                    Lihat detail
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section id="quiz" className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="border border-border/70 bg-card/95 shadow-sm">
            <CardHeader className="border-b border-border/70">
              <CardTitle>Alur akses yang disarankan</CardTitle>
              <CardDescription>
                Model ini tetap simpel, tapi sudah siap untuk konten gratis dan gated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {steps.map(({ title, description, icon: Icon }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-4"
                >
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-primary">Quiz dan evaluasi</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Tombol aksi dibuat jelas sejak awal
              </h2>
            </div>

            <div className="grid gap-4">
              {quizPacks.map((quiz) => {
                const requiresLogin = quiz.access !== "Gratis";

                return (
                  <Card
                    key={quiz.title}
                    className="border border-border/70 bg-card/95 shadow-sm"
                  >
                    <CardContent className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={requiresLogin ? "outline" : "secondary"}>
                            {quiz.access}
                          </Badge>
                          <span className="text-xs font-medium text-muted-foreground">
                            {quiz.items}
                          </span>
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {quiz.title}
                          </p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {quiz.mode}
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/"
                        className={cn(
                          buttonVariants({
                            variant: requiresLogin ? "outline" : "default",
                            size: "lg",
                          }),
                          "px-4",
                        )}
                      >
                        <CirclePlay className="size-4" />
                        {requiresLogin ? "Lihat syarat akses" : "Mulai sekarang"}
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
