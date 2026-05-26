"use client";

import dynamic from "next/dynamic";

const PreviewMaterialViewer = dynamic(
  () => import("@/components/preview-material-viewer").then((mod) => mod.PreviewMaterialViewer),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-[20px] border border-[#d8e2f3] bg-[#f8fbff] px-6 py-10 text-center text-[15px] text-[#596983]">
        Menyiapkan viewer materi...
      </div>
    ),
  },
);

type MaterialViewerClientProps = {
  title: string;
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  fileUrl: string | null;
};

export function MaterialViewerClient(props: MaterialViewerClientProps) {
  return <PreviewMaterialViewer {...props} />;
}
