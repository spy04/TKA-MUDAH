import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { StudentMaterialDetailView } from "@/components/student-material-detail-view";
import { requireUserRole } from "@/lib/auth/session";
import { getPublicMaterialDetail } from "@/lib/public-content";

type StudentMaterialDetailPageProps = {
  params: Promise<{ materialId: string }>;
};

export default async function StudentMaterialDetailPage({ params }: StudentMaterialDetailPageProps) {
  const user = await requireUserRole("STUDENT");
  const { materialId } = await params;
  const material = await getPublicMaterialDetail(materialId);

  if (!material) {
    notFound();
  }

  return (
    <StudentMaterialDetailView
      material={material}
      logoutAction={logoutAction}
      displayName={user.name?.trim() || "Adik"}
    />
  );
}
