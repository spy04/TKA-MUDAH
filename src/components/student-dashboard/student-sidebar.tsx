import Link from "next/link";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "@/components/student-dashboard/data";

type StudentSidebarProps = {
  displayName: string;
  menus: SidebarItem[];
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentSidebar({
  displayName,
  menus,
  logoutAction,
}: StudentSidebarProps) {
  return (
    <aside className="hidden w-[190px] shrink-0 lg:block">
      <div className="rounded-[22px] border border-[#d8e2f3] bg-[#eef3ff] px-2 py-5 shadow-[0_20px_36px_-34px_rgba(15,23,42,0.32)]">
        <div className="border-b border-[#d8e2f3] px-2 pb-5">
          <p className="text-[16px] font-black text-[#2563eb]">Halo, {displayName}!</p>
          <p className="mt-1 text-[12px] text-[#73829b]">Siap belajar hari ini?</p>
        </div>

        <nav className="mt-4 space-y-1">
          {menus.map(({ label, href, icon: Icon, active }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex h-[42px] items-center gap-3 rounded-[8px] px-3 text-[14px] font-semibold transition-colors",
                active
                  ? "bg-[#2563eb] text-white"
                  : "text-[#4f5f78] hover:bg-white hover:text-[#1f2f46]",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="#simulasi"
          className="mx-1 mt-4 flex h-[42px] items-center justify-center rounded-[8px] bg-[#0f8a63] text-[14px] font-bold text-white shadow-[0_18px_30px_-24px_rgba(15,138,99,0.85)]"
        >
          Upgrade Premium
        </Link>

        {logoutAction ? (
          <form action={logoutAction} className="mt-8 px-2 pb-1">
            <Button
              type="submit"
              variant="ghost"
              className="h-auto px-0 py-2 text-[14px] font-semibold text-[#ef4444] hover:bg-transparent hover:text-[#dc2626]"
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
