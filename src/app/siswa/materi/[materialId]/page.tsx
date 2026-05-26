import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { MaterialDetailView } from "@/components/material-detail-view";
import { requireUserRole } from "@/lib/auth/session";
import { getStudentMaterialDetail } from "@/lib/public-content";

type StudentMaterialDetailPageProps = {
  params: Promise<{ materialId: string }>;
};

export default async function StudentMaterialDetailPage({ params }: StudentMaterialDetailPageProps) {
  const user = await requireUserRole("STUDENT");
  const { materialId } = await params;
  const material = await getStudentMaterialDetail(materialId);

  if (!material) {
    notFound();
  }

  return (
    <MaterialDetailView
      material={material}
      logoutAction={logoutAction}
      homeHref="/siswa"
      displayName={user.name?.trim() || "Adik"}
      isEnrolled
    />
  );
}
