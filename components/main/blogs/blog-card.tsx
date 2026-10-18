"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDisplayImageUrl } from "@/lib/image-url";
function stripHtmlTags(html: string): string {
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>?/gm, "");
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string | null;
  tags: string[];
  readTime: string;
  createdAt: string;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export function BlogCard({ data }: { data: Blog }) {
  const dateStr = format(new Date(data.createdAt), "MMM d, yyyy", {
    locale: enUS,
  });

  const summaryContent = stripHtmlTags(data.content);

  return (
    <Link href={`/blogs/${data.slug}`} className="group flex flex-col h-full">
      <div className="relative flex flex-col h-full bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        <div className="relative h-60 w-full overflow-hidden">
          <Image
            src={getDisplayImageUrl(data.coverUrl)}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />

          <div className="absolute top-4 left-4 flex gap-2">
            {data.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{dateStr}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{data.readTime}</span>
            </div>
          </div>

          <h3 className="font-oswald text-2xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {data.title}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
            {summaryContent}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                <Image
                  src={data.author.avatarUrl}
                  alt={data.author.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-foreground">
                {data.author.name}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
