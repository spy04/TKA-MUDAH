import Link from "next/link";

import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/student-dashboard/data";

type PublicTopNavbarProps = {
  homeHref: string;
  menus: NavItem[];
};

export function PublicTopNavbar({
  homeHref,
  menus,
}: PublicTopNavbarProps) {
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
      </div>
    </header>
  );
}
