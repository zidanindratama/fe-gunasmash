"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { ArrowLeft, Calendar, Clock, Share2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetData } from "@/hooks/use-get-data";
import { Skeleton } from "@/components/ui/skeleton";
import { getDisplayImageUrl } from "@/lib/image-url";

interface BlogDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  readTime?: string;
}
const HtmlContent = ({ content }: { content: string }) => (
  <div className="prose dark:prose-invert max-w-none">
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

export function BlogDetailView({ slug }: { slug: string }) {
  const { data, isLoading, isError } = useGetData<BlogDetail>({
    url: `/blogs/${slug}`,
    key: ["blog-detail", slug],
  });

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const readTime = data?.content
    ? calculateReadTime(data.content)
    : "5 min read";

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 max-w-4xl mx-auto">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-16 w-full mb-8" />
        <div className="flex gap-4 mb-12">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="w-full aspect-video rounded-3xl mb-12" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h2 className="font-oswald text-4xl mb-4">Article Not Found</h2>
        <Button asChild>
          <Link href="/blogs">Back to Blogs</Link>
        </Button>
      </div>
    );
  }

  const dateStr = format(new Date(data.createdAt), "MMMM d, yyyy", {
    locale: enUS,
  });

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-20 px-6 md:px-12">
      <article className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Articles
          </Link>

          <div className="flex flex-wrap gap-2 mb-6">
            {data.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-1 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="font-oswald text-4xl md:text-6xl font-bold leading-[1.1] text-foreground mb-8">
            {data.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-border/50">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border">
                {data.author && (
                  <Image
                    src={
                      data.author.avatarUrl ||
                      "https://i.pravatar.cc/150?u=fallback"
                    }
                    alt={data.author.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-bold text-foreground text-lg leading-none mb-1">
                  {data.author?.name || "Unknown Author"}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {dateStr}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {readTime}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 rounded-full"
            >
              <Share2 className="w-4 h-4" /> Share Article
            </Button>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-12 border border-border/50 shadow-sm">
          <Image
            src={getDisplayImageUrl(data.coverUrl)}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="md:px-4">
          <HtmlContent content={data.content || "No content available."} />
        </div>

        <div className="mt-16 pt-8 border-t border-border flex items-center gap-4">
          <Tag className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
            Filed under: {data.tags.join(", ")}
          </span>
        </div>
      </article>
    </div>
  );
}
