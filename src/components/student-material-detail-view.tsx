import Link from "next/link";
import { AlertTriangle, Shield } from "lucide-react";

import { StudentAppLayout } from "@/components/layouts/student-app-layout";
import { MaterialViewerClient } from "@/components/material-viewer-client";
import { buildSidebarMenus } from "@/components/student-dashboard/data";
import type { PublicMaterialDetail } from "@/lib/public-content";

type StudentMaterialDetailViewProps = {
  material: PublicMaterialDetail;
  displayName: string;
  logoutAction?: (formData: FormData) => void | Promise<void>;
};

export function StudentMaterialDetailView({
  material,
  displayName,
  logoutAction,
}: StudentMaterialDetailViewProps) {
  return (
    <StudentAppLayout
      displayName={displayName}
      sidebarMenus={buildSidebarMenus("/siswa", "topics")}
      logoutAction={logoutAction}
    >
      <section className="rounded-[28px] border border-[#dce5f4] bg-[#f8faff] px-5 py-5 shadow-[0_24px_40px_-34px_rgba(15,23,42,0.28)] sm:px-6 lg:px-7">
        <Link href={`/siswa/topik/${material.topic.slug}`} className="text-[14px] font-bold text-[#2563eb]">
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

            <h1 className="mt-4 text-[34px] font-black tracking-tight text-[#1f2f46] lg:text-[42px]">{material.title}</h1>
            <p className="mt-3 text-[15px] leading-8 text-[#596983]">
              {material.description?.trim() || "Materi preview ini bisa dibuka langsung di website."}
            </p>
          </div>

          <div className="rounded-[18px] border border-[#e3eaf6] bg-white px-4 py-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-5 text-[#2563eb]" />
              <div className="text-[13px] leading-6 text-[#596983]">
                Viewer ini dibuat untuk baca materi langsung di web. Progres belajarmu tetap lebih rapi saat dibuka dari akun siswa.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <MaterialViewerClient title={material.title} type={material.type} fileUrl={material.fileUrl} />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-[18px] border border-[#fde68a] bg-[#fffbea] px-4 py-4 text-[13px] leading-6 text-[#7c5a10]">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
          Untuk perlindungan konten yang lebih kuat, langkah berikutnya sebaiknya pakai signed URL singkat, watermark
          nama user, dan validasi akses per material dari backend.
        </div>
      </section>
    </StudentAppLayout>
  );
}
