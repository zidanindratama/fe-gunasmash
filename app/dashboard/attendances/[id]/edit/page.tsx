import { SessionEditView } from "@/components/dashboard/attendances/session-edit-view";

interface PageProps {
  params: { id: string };
}

export default async function SessionEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return <SessionEditView id={id} />;
}
