import { BookOpen, CheckCircle2, GraduationCap, PlayCircle } from "lucide-react";

import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserRole } from "@/lib/auth/session";

export default async function StudentPage() {
  const user = await requireUserRole("STUDENT");

  const stats = [
    { label: "Course aktif", value: "4", icon: BookOpen },
    { label: "Materi selesai", value: "18", icon: CheckCircle2 },
    { label: "Video", value: "9", icon: PlayCircle },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card className="w-full border-border/70">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <CardTitle>Dashboard Siswa</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline">
                Logout
              </Button>
            </form>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border/70 bg-card/95">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-primary" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Lanjut belajar</CardTitle>
            <CardDescription>Area awal siswa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
              <p className="font-medium text-foreground">Matematika Kelas 10</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Bab berikutnya: Persamaan linear.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/90 p-4">
              <p className="font-medium text-foreground">Bahasa Inggris</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Quiz tersedia untuk dikerjakan.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Akun</CardTitle>
            <CardDescription>{user.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              Role: Siswa
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              Status: Aktif
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
