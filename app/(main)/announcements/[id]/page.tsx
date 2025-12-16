import { AnnouncementDetailView } from "@/components/main/announcements/announcement-detail-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <AnnouncementDetailView id={id} backLink="/announcements" />;
}
