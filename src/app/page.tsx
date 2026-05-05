import { redirect } from "next/navigation";
import { BookOpen, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";

const roleInfo = [
  {
    title: "Admin",
    description:
      "Masuk untuk mengelola user, materi, soal, dan alur belajar di LMS.",
    icon: ShieldCheck,
  },
  {
    title: "Siswa",
    description:
      "Masuk untuk melihat course, membuka materi, dan mengerjakan latihan soal.",
    icon: GraduationCap,
  },
];

const quickStats = [
  { label: "Role", value: "2" },
  { label: "Session", value: "DB" },
  { label: "Akses", value: "Aman" },
];

export default async function Home() {
  const user = await getCurrentUser();

  if (user?.role === "ADMIN") {
    redirect("/admin");
  }

  if (user?.role === "STUDENT") {
    redirect("/siswa");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid w-full gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[32px] border border-border/70 bg-card/95 shadow-sm">
          <div className="border-b border-border/70 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <BookOpen className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">TKA Mudah</p>
                  <p className="text-sm text-muted-foreground">Learning Management System</p>
                </div>
              </div>
              <Badge variant="secondary">v1 Auth</Badge>
            </div>
          </div>

          <div className="space-y-8 px-6 py-8 sm:px-8 sm:py-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="size-4" />
                <span className="text-sm font-medium">Masuk ke sistem</span>
              </div>
              <div className="space-y-3">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Satu akses untuk admin dan siswa.
                </h1>
                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                  Login dulu. Dashboard akan mengikuti role akun yang dipakai.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {roleInfo.map(({ title, description, icon: Icon }) => (
                <Card key={title} className="border-border/70 bg-background/85">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <p className="text-base font-semibold text-foreground">{title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/70 bg-background/80 px-4 py-5"
                >
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
