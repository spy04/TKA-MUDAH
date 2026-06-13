import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/student-dashboard/data";

type StudentNavbarProps = {
  avatarText: string;
  homeHref: string;
  menus: NavItem[];
  isAuthenticated?: boolean;
};

export function StudentNavbar({
  avatarText,
  homeHref,
  menus,
  isAuthenticated = false,
}: StudentNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#d8e2f3]/80 bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 lg:px-6">
        <div className="flex items-center gap-8">
          <Link href={homeHref} className="text-[18px] font-black tracking-tight text-[#2563eb]">
            TKAMUDAH
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {menus.map((menu) => (
              <Link
                key={menu.label}
                href={menu.href}
                className={cn(
                  "relative text-[14px] font-semibold transition-colors",
                  menu.active ? "text-[#2563eb]" : "text-[#5f6d83] hover:text-[#1f2f46]",
                )}
              >
                {menu.label}
                {menu.active ? (
                  <span className="absolute inset-x-0 -bottom-[24px] h-[2px] rounded-full bg-[#2563eb]" />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="relative hidden w-[178px] lg:block xl:w-[180px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#93a1b8]" />
              <Input
                aria-label="Cari materi"
                placeholder="Cari materi..."
                className="h-[42px] rounded-full border-[#d8e2f3] bg-[#f8fbff] pl-11 pr-4 text-[13px] shadow-none"
              />
            </div>

            <button
              type="button"
              aria-label="Notifikasi"
              className="flex size-9 items-center justify-center rounded-full text-[#5f6d83] transition-colors hover:bg-[#f4f7ff]"
            >
              <Bell className="size-4" />
            </button>

            <button
              type="button"
              aria-label="Bantuan"
              className="flex size-9 items-center justify-center rounded-full text-[#5f6d83] transition-colors hover:bg-[#f4f7ff]"
            >
              <Search className="size-4" />
            </button>

            <div className="rounded-full border border-[#2563eb] p-[2px]">
              <div className="flex size-9 items-center justify-center rounded-full bg-[#2563eb] text-[13px] font-bold text-white">
                {avatarText}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/masuk"
              className="rounded-full px-4 py-2 text-[14px] font-semibold text-[#2563eb] transition hover:bg-[#eef3ff]"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white shadow-[0_18px_28px_-22px_rgba(37,99,235,0.9)] transition hover:bg-[#1f58da]"
            >
              Daftar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
