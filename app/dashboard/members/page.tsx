import { MemberDataTable } from "@/components/dashboard/members/member-datatable";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
          Members
        </h1>
        <p className="text-muted-foreground">
          Manage your club members, monitor status, and roles.
        </p>
      </div>

      <MemberDataTable />
    </div>
  );
}
