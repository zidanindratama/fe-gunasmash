"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowLeft, Calendar, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2070&auto=format&fit=crop";

interface AnnouncementData {
  id: string;
  title: string;
  type: string;
  datetime: string;
  location: string;
  locationLink: string | null;
  imageUrl: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function AnnouncementDetailView({
  id,
  backLink = "/announcements",
}: {
  id: string;
  backLink?: string;
}) {
  const { data, isLoading, isError } = useGetData<AnnouncementData>({
    url: `/announcements/${id}`,
    key: ["announcement-detail", id],
  });

  const HtmlContent = ({ content }: { content: string }) => (
    <div className="prose dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-5xl mx-auto">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-12 w-full mb-8" />
        <div className="flex gap-4 mb-12">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="w-full aspect-[21/9] rounded-3xl mb-12" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="font-oswald text-4xl mb-4">404 Not Found</h2>
        <Button asChild>
          <Link href={backLink}>Kembali</Link>
        </Button>
      </div>
    );
  }

  const dateStr = format(new Date(data.datetime), "EEEE, d MMMM yyyy", {
    locale: idLocale,
  });
  const timeStr = format(new Date(data.datetime), "HH:mm 'WIB'");

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <Badge
              variant="secondary"
              className="text-sm font-bold uppercase tracking-wider px-3 py-1 bg-primary/10 text-primary border-primary/20"
            >
              {data.type}
            </Badge>
          </div>

          <h1 className="font-oswald text-4xl md:text-6xl font-bold uppercase leading-[0.9] text-foreground mb-6">
            {data.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-muted-foreground pb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{dateStr}</p>
                <p className="text-sm">{timeStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{data.location}</p>
                <a
                  href={data.locationLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Lihat di Peta
                </a>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden sm:flex gap-2"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>
        </div>

        <div className="relative w-full aspect-video (16/9) md:aspect-[21/9] rounded-3xl overflow-hidden mb-10 border border-border/50 shadow-lg">
          <Image
            src={data.imageUrl || FALLBACK_IMAGE}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="md:px-4 max-w-4xl mx-auto">
          <HtmlContent content={data.content} />
        </div>
      </div>
    </div>
  );
}
