"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Tag, MoveRight, ArrowLeft } from "lucide-react";

import api from "@/lib/axios-instance";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl?: string | null;
  tags: string[];
  published: boolean;
  createdAt: string;
};

type OkResponse<T> = { success: true; data: T };
type ErrResponse = { success: false; error: { message: string } };
type ApiResponse<T> = OkResponse<T> | ErrResponse;

function fmtDate(dt: string) {
  const d = new Date(dt);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

function readingTime(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / 225)); // ~225 wpm
  return `${minutes} menit baca`;
}

async function fetchBlog(id: string): Promise<Blog> {
  const res = await api.get<ApiResponse<Blog>>(`/api/blogs/${id}`);
  if (!("success" in res.data) || !res.data.success) {
    const err = new Error("Failed to fetch") as any;
    (err.response ??= {}).status = (res as any)?.status;
    throw err;
  }
  // Normalisasi coverUrl supaya null jika kosong
  const b = res.data.data;
  return {
    ...b,
    coverUrl: b.coverUrl ?? null,
  };
}

function ArticleShell({ blog }: { blog: Blog }) {
  const timeToRead = React.useMemo(
    () => readingTime(blog.content),
    [blog.content]
  );

  return (
    <main className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/blogs"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Blog
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="truncate">{blog.title}</span>
        </div>

        {/* Header */}
        <header className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            {blog.tags?.length
              ? blog.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-[11px] font-medium"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {t}
                    </span>
                  </Badge>
                ))
              : null}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {blog.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {fmtDate(blog.createdAt)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {timeToRead}
            </span>
            {!blog.published ? (
              <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                Draft
              </span>
            ) : null}
          </div>
        </header>

        {/* Cover */}
        {blog.coverUrl ? (
          <Card className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-3xl">
            <AspectRatio ratio={16 / 7}>
              <Image
                src={blog.coverUrl}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
            </AspectRatio>
          </Card>
        ) : (
          <div className="mx-auto mt-6 h-44 max-w-5xl rounded-3xl border bg-muted/40" />
        )}

        {/* Body */}
        <section className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(220px,280px)]">
          <article
            className={cn(
              "prose prose-zinc max-w-none dark:prose-invert",
              // tweak kecil agar cocok tampilan
              "[&_:where(img,video,figure)]:rounded-xl [&_:where(img,video,figure)]:shadow-sm"
            )}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Info card sederhana (beda dari announcement) */}
          <div className="lg:pt-2">
            <Card className="rounded-2xl">
              <CardContent className="p-5">
                <div className="text-sm font-semibold">Ringkasan</div>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4" />
                    <div>
                      <div className="text-foreground">Dipublikasikan</div>
                      <div>{fmtDate(blog.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4" />
                    <div>
                      <div className="text-foreground">Perkiraan baca</div>
                      <div>{timeToRead}</div>
                    </div>
                  </div>
                </div>

                {blog.tags?.length ? (
                  <>
                    <Separator className="my-4" />
                    <div className="text-sm font-semibold">Tag</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {blog.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="rounded-full"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : null}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/blogs">Kembali</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link
                      href="/auth/sign-up"
                      className="inline-flex items-center gap-2"
                    >
                      Gabung <MoveRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}

export function BlogDetailSkeleton() {
  return (
    <main className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-4" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-10 w-4/5" />
          <div className="mt-3 flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <Skeleton className="mx-auto mt-6 h-60 w-full max-w-5xl rounded-3xl" />
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(220px,280px)]">
          <div className="space-y-3">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="rounded-2xl border p-5">
            <Skeleton className="mb-3 h-5 w-24" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Separator className="my-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function useBlog(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlog(id),
    retry: (count, err: any) => {
      if (err?.response?.status === 404) return false;
      return count < 2;
    },
  });
}

export function BlogDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useBlog(id);

  React.useEffect(() => {
    if (!isLoading && isError && (error as any)?.response?.status === 404) {
      router.replace("/blogs");
    }
  }, [isLoading, isError, error, router]);

  if (isLoading) return <BlogDetailSkeleton />;
  if (!data) return null;

  return <ArticleShell blog={data} />;
}
