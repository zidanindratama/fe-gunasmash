// components/main/announcements/announcement-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Asumsi Interface ---
// Ini harus diimpor dari file data/type yang sesuai di proyek Anda.
interface Announcement {
  id: string;
  title: string;
  type: AnnouncementType;
  datetime: string;
  location: string;
  locationLink: string | null;
  imageUrl: string | null;
  content: string;
}
type AnnouncementType =
  | "TRAINING"
  | "SPARRING"
  | "TOURNAMENT"
  | "BRIEFING"
  | "RECRUITMENT"
  | "EVENT"
  | "INFO";
// ------------------------

const TYPE_COLORS: Record<AnnouncementType, string> = {
  TRAINING:
    "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20",
  SPARRING: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20",
  TOURNAMENT:
    "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
  BRIEFING:
    "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20",
  RECRUITMENT:
    "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20",
  EVENT: "bg-pink-500/10 text-pink-500 border-pink-500/20 hover:bg-pink-500/20",
  INFO: "bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20",
};

export function AnnouncementCard({ data }: { data: Announcement }) {
  const dateStr = format(new Date(data.datetime), "EEEE, d MMMM yyyy • HH:mm", {
    locale: id,
  });

  const isTraining = data.type === "TRAINING" || data.type === "SPARRING";
  // Asumsi semua link detail menggunakan /announcements/:id
  const href = `/announcements/${data.id}`;

  return (
    <Link href={href} className="group block h-full">
      <div className="relative flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        {data.imageUrl && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={data.imageUrl}
              alt={data.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
          </div>
        )}

        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-4">
            <Badge
              variant="outline"
              className={`${
                TYPE_COLORS[data.type]
              } px-3 py-1 text-xs font-bold uppercase tracking-wider`}
            >
              {data.type}
            </Badge>
          </div>

          <h3 className="font-oswald text-2xl uppercase font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {data.title}
          </h3>

          <div className="space-y-2 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{dateStr} WIB</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">{data.location}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
            {data.content}
          </p>

          <div className="mt-auto">
            <Button
              asChild
              variant="outline"
              className="w-full justify-between group/btn hover:border-primary hover:text-primary pointer-events-none"
            >
              <div>
                View Details
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 ml-2 inline-block" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
