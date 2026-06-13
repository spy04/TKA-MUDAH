import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <div className="rounded-[22px] border border-[#dce5f4] bg-[#eef3ff] px-2 py-4 shadow-[0_22px_34px_-30px_rgba(15,23,42,0.35)]">
        <div className="rounded-[16px] bg-white px-3 py-3 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.35)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#60a5fa_0%,#2563eb_100%)] text-sm font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-black text-[#2563eb]">Halo, {displayName}!</p>
              <p className="text-[11px] text-[#73829b]">{helperText}</p>
            </div>
          </div>
        </div>

        <nav className="mt-5 space-y-1">
          {menus.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex h-[42px] items-center gap-3 rounded-[10px] px-3 text-[14px] font-semibold transition-colors",
                active
                  ? "bg-[#2f5cf3] text-white shadow-[0_18px_26px_-22px_rgba(47,92,243,0.95)]"
                  : "text-[#43536d] hover:bg-white hover:text-[#1f2f46]",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        {showPremiumCard ? (
          <div className="mt-6 rounded-[16px] bg-[#0f8a63] px-4 py-4 text-white shadow-[0_20px_34px_-28px_rgba(15,138,99,0.9)]">
            <p className="text-[14px] font-bold">Upgrade Premium</p>
            <p className="mt-1 text-[11px] leading-5 text-white/80">
              Buka akses ke materi terbaru dan simulasi lengkap.
            </p>
            <Link
              href="/daftar"
              className="mt-4 flex h-[40px] items-center justify-center rounded-[10px] bg-white text-[14px] font-bold text-[#2563eb]"
            >
              Daftar Sekarang
            </Link>
          </div>
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
      </div>
    </aside>
  );
}
