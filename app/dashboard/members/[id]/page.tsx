import { MemberDetailView } from "@/components/dashboard/members/member-detail-view";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MemberDetailPage(props: PageProps) {
  const params = await props.params;

  return (
    <div className="space-y-6">
      <MemberDetailView id={params.id} />
    </div>
  );
}
