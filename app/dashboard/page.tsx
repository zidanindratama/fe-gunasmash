"use client";

import { useGetData } from "@/hooks/use-get-data";

interface GlobalStats {
  users: { total: number; admins: number; members: number };
  announcements: { total: number };
  blogs: { total: number; published: number; unpublished: number };
  sessions: { total: number; today: number; upcomingOpen: number };
}

export default function DashboardOverview() {
  const { data, isLoading, isError } = useGetData<GlobalStats>({
    key: ["stats"],
    url: "/stats",
  });

  const cards = [
    { label: "Total Members", value: data?.users.members },
    { label: "Announcements", value: data?.announcements.total },
    { label: "Published Blogs", value: data?.blogs.published },
    { label: "Attendance Sessions", value: data?.sessions.total },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground">
          A live summary of your GunaSmash activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {card.label}
            </h2>
            <p className="mt-2 text-3xl font-bold" aria-live="polite">
              {isLoading ? "—" : isError ? "Unavailable" : (card.value ?? 0)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
