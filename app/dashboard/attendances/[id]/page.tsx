import { SessionDetailView } from "@/components/dashboard/attendances/session-detail-view";

interface PageProps {
  params: { id: string };
}

export default async function SessionDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <SessionDetailView id={id} />;
}
