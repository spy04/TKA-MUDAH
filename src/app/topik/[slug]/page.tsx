import { notFound } from "next/navigation";

import { PublicTopicDetailView } from "@/components/public-topic-detail-view";
import { getPublicTopicDetail } from "@/lib/public-content";

type TopicDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function TopicDetailPage({ params }: TopicDetailPageProps) {
  const { slug } = await params;
  const topic = await getPublicTopicDetail(slug);

  if (!topic) {
    notFound();
  }

  return <PublicTopicDetailView topic={topic} />;
}
