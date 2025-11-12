import Announcements from "@/components/main/announcements/announcements";
import { Suspense } from "react";

export default function AnnouncementPage() {
  return (
    <>
      <Suspense>
        <Announcements />
      </Suspense>
    </>
  );
}
