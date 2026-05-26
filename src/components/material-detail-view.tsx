import Link from "next/link";
import { AlertTriangle, Shield } from "lucide-react";

import { buildHeaderMenus, buildSidebarMenus } from "@/components/student-dashboard/data";
import { MaterialViewerClient } from "@/components/material-viewer-client";
import { StudentFooter } from "@/components/student-dashboard/student-footer";
import { StudentNavbar } from "@/components/student-dashboard/student-navbar";
import { StudentSidebar } from "@/components/student-dashboard/student-sidebar";
import type { PublicMaterialDetail } from "@/lib/public-content";

type MaterialDetailViewProps = {
  material: PublicMaterialDetail;
  displayName?: string;
  homeHref?: string;
  isEnrolled?: boolean;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function MaterialDetailView({
  material,
  displayName = "Adik",
  homeHref = "/",
  isEnrolled = false,
  logoutAction,
}: MaterialDetailViewProps) {
  const headerMenus = buildHeaderMenus(homeHref, "topics");
  const sidebarMenus = buildSidebarMenus(homeHref, "topics");
  const avatarText = displayName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#eaf1ff] text-[#1f2f46]">
      <StudentNavbar avatarText={avatarText} homeHref={homeHref} menus={headerMenus} />

      <div className="bg-[#f5f8ff]">
        <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-6 lg:px-6">
          <div className="hidden self-start pt-2 lg:sticky lg:top-[84px] lg:block">
            <StudentSidebar displayName={displayName} menus={sidebarMenus} logoutAction={logoutAction} />
          </div>

          <div className="min-w-0 flex-1">
            <section className="rounded-[24px] border border-[#d8e2f3] bg-white px-6 py-7 shadow-[0_20px_42px_-36px_rgba(15,23,42,0.45)] lg:px-8">
              <Link
                href={isEnrolled ? `/siswa/topik/${material.topic.slug}` : `/topik/${material.topic.slug}`}
                className="text-[14px] font-bold text-[#2563eb]"
              >
                Kembali ke topik {material.topic.title}
              </Link>

              <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-[760px]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[12px] font-bold text-[#2563eb]">
                      {material.topic.category}
                    </span>
                    <span className="rounded-full bg-[#f8fbff] px-3 py-1 text-[12px] font-bold text-[#73829b]">
                      {material.type}
                    </span>
                  </div>

                  <h1 className="mt-4 text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">
                    {material.title}
                  </h1>
                  <p className="mt-3 text-[15px] leading-8 text-[#596983]">
                    {material.description?.trim() || "Materi preview ini bisa dibuka langsung di website."}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#e3eaf6] bg-[#f8fbff] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 size-5 text-[#2563eb]" />
                    <div className="text-[13px] leading-6 text-[#596983]">
                      Viewer ini dibuat untuk baca materi langsung di web. Klik kanan saya matikan sebagai deterrent,
                      tapi ini bukan proteksi absolut terhadap screenshot atau inspect network.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <MaterialViewerClient title={material.title} type={material.type} fileUrl={material.fileUrl} />
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-[18px] border border-[#fde68a] bg-[#fffbea] px-4 py-4 text-[13px] leading-6 text-[#7c5a10]">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                Untuk perlindungan konten yang lebih kuat, langkah berikutnya sebaiknya pakai signed URL singkat,
                watermark nama user, dan validasi akses per material dari backend.
              </div>
            </section>

            <div className="min-h-[220px]" />
          </div>
        </div>
      </div>

      <StudentFooter />
    </main>
  );
}
