import AnnouncementDetail from "@/components/main/announcements/announcement-detail";

export default async function AnnouncementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnnouncementDetail id={id} />;
}
