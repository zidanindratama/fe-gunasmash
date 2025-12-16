import { SessionDataTable } from "@/components/dashboard/attendances/session-datatable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AttendancesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
            Attendance Sessions
          </h1>
          <p className="text-muted-foreground">
            Manage training schedules and track member presence.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/attendances/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Session
          </Link>
        </Button>
      </div>

      <SessionDataTable />
    </div>
  );
}
