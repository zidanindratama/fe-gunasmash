import { AnnouncementsView } from "@/components/main/announcements/announcements-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Announcements",
  description:
    "Stay updated with the latest news, events, tournaments, and schedules from the GunaSmash community.",
  keywords: ["GunaSmash News", "Club Events", "Tournament Schedule"],
};

export default function AnnouncementsPage() {
  return <AnnouncementsView />;
}
