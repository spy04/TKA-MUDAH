import { notFound } from "next/navigation";

import { logoutAction } from "@/app/actions/auth";
import { TopicDetailView } from "@/components/topic-detail-view";
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
    <TopicDetailView
      topic={topic}
      displayName={user.name?.trim() || "Adik"}
      homeHref="/siswa"
      isEnrolled
      logoutAction={logoutAction}
    />
  );
}
