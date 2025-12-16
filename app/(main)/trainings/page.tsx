import { TrainingsView } from "@/components/main/trainings/trainings-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Schedules",
  description:
    "View the latest training drills and sparring sessions schedules for GunaSmash members. Find locations and times.",
  keywords: [
    "Badminton Training Schedule",
    "Sparring Time",
    "GunaSmash Practice",
  ],
};

export default function TrainingsPage() {
  return <TrainingsView />;
}
