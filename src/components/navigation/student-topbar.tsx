import Link from "next/link";
import { Bell, CircleHelp, Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type StudentTopbarProps = {
  avatarText: string;
  homeHref?: string;
};

export function StudentTopbar({
  avatarText,
  homeHref = "/siswa",
}: StudentTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#dce5f4] bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-[74px] w-full max-w-[1440px] items-center justify-between gap-4 px-5 lg:px-7">
        <Link href={homeHref} className="text-[17px] font-black tracking-tight text-[#2563eb]">
          TKAMUDAH
        </Link>

        <div className="flex items-center gap-2">
          <div className="relative hidden w-[250px] lg:block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#98a5bc]" />
            <Input
              aria-label="Cari materi"
              placeholder="Cari materi..."
              className="h-[42px] rounded-full border-[#dce5f4] bg-[#f6f8fe] pl-11 pr-10 text-[13px] shadow-none"
            />
          </div>

          <button
            type="button"
            aria-label="Notifikasi"
            className="flex size-9 items-center justify-center rounded-full text-[#5f6d83] transition hover:bg-[#eff4ff]"
          >
            <Bell className="size-4" />
          </button>

          <button
            type="button"
            aria-label="Bantuan"
            className="flex size-9 items-center justify-center rounded-full text-[#5f6d83] transition hover:bg-[#eff4ff]"
          >
            <CircleHelp className="size-4" />
          </button>

          <div className="ml-1 rounded-full border border-[#dce5f4] bg-white p-[2px] shadow-sm">
            <div className="flex size-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,#3b82f6_0%,#1d4ed8_100%)] text-[13px] font-bold text-white">
              {avatarText}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
