import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { StudentTopicDetailView } from "@/components/student-topic-detail-view";
import { requireUserRole } from "@/lib/auth/session";
import { getPublicTopicDetail } from "@/lib/public-content";

type StudentTopicDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function StudentTopicDetailPage({ params }: StudentTopicDetailPageProps) {
  const user = await requireUserRole("STUDENT");
  const { slug } = await params;
  const topic = await getPublicTopicDetail(slug);

  if (!topic) {
    notFound();
  }

  return (
    <StudentTopicDetailView
      topic={topic}
      displayName={user.name?.trim() || "Adik"}
      logoutAction={logoutAction}
    />
  );
}
