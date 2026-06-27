import Link from "next/link";
import { LogOut } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "@/components/student-dashboard/data";

type StudentSidebarNavProps = {
  displayName: string;
  menus: SidebarItem[];
  logoutAction?: (formData: FormData) => void | Promise<void>;
  helperText?: string;
  showPremiumCard?: boolean;
};

export function StudentSidebarNav({
  displayName,
  menus,
  logoutAction,
  helperText = "Siap belajar hari ini?",
  showPremiumCard = true,
}: StudentSidebarNavProps) {
  return (
    <aside className="hidden w-[196px] shrink-0 lg:block">
      <Card className="rounded-[22px] border-[#dce5f4] bg-[#eef3ff] py-0 shadow-[0_22px_34px_-30px_rgba(15,23,42,0.35)]">
        <CardContent className="px-2 py-4">
          <Card className="rounded-[16px] border-white bg-white py-0 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.35)]">
            <CardContent className="px-3 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#60a5fa_0%,#2563eb_100%)] text-sm font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-black text-[#2563eb]">Halo, {displayName}!</p>
              <p className="text-[11px] text-[#73829b]">{helperText}</p>
            </div>
          </div>
            </CardContent>
          </Card>

          <nav className="mt-5 space-y-1">
            {menus.map(({ label, href, icon: Icon, active }) => (
              <Button
                key={label}
                render={
                  <Link href={href} />
                }
                nativeButton={false}
                variant={active ? "default" : "ghost"}
                size="lg"
                className={cn(
                  "h-[42px] w-full justify-start gap-3 rounded-[10px] px-3 text-[14px] font-semibold",
                  active
                    ? "bg-[#2f5cf3] text-white shadow-[0_18px_26px_-22px_rgba(47,92,243,0.95)] hover:bg-[#2f5cf3]"
                    : "text-[#43536d] hover:bg-white hover:text-[#1f2f46]",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </nav>

          {showPremiumCard ? (
            <Card className="mt-6 rounded-[16px] border-0 bg-[#0f8a63] py-0 text-white shadow-[0_20px_34px_-28px_rgba(15,138,99,0.9)]">
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-bold">Upgrade Premium</p>
                  <Badge className="bg-white/16 text-white hover:bg-white/16">Akses penuh</Badge>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-white/80">
                  Buka akses ke materi terbaru dan simulasi lengkap.
                </p>
                <Button
                  render={
                    <Link href="/daftar" />
                  }
                  nativeButton={false}
                  variant="secondary"
                  size="lg"
                  className="mt-4 h-[40px] w-full rounded-[10px] bg-white font-bold text-[#2563eb] hover:bg-white/95"
                >
                  Daftar Sekarang
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {logoutAction ? (
            <form action={logoutAction} className="mt-6 px-2">
              <Button
                type="submit"
                variant="ghost"
                className="h-auto px-1 py-2 text-[14px] font-semibold text-[#ef4444] hover:bg-transparent hover:text-[#dc2626]"
              >
                <LogOut className="size-4" />
                Keluar
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </aside>
  );
}
