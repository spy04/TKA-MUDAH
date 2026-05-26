import { notFound } from "next/navigation";

import { MaterialDetailView } from "@/components/material-detail-view";
import { getPublicMaterialDetail } from "@/lib/public-content";

type MaterialDetailPageProps = {
  params: Promise<{ materialId: string }>;
};

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const { materialId } = await params;
  const material = await getPublicMaterialDetail(materialId);

  if (!material) {
    notFound();
  }

  return <MaterialDetailView material={material} />;
}
