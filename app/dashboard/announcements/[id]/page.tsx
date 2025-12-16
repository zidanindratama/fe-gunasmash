import { AnnouncementEditView } from "@/components/dashboard/announcements/announcement-edit-view";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AnnouncementEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className="space-y-6">
      <AnnouncementEditView id={id} />
    </div>
  );
}
