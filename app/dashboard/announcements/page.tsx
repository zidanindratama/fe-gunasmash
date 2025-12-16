import { AnnouncementDataTable } from "@/components/dashboard/announcements/announcement-datatable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Manage training schedules, events, and club info.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/announcements/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      <AnnouncementDataTable />
    </div>
  );
}
