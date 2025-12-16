"use client";

import { cn } from "@/lib/utils";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className }: HtmlContentProps) {
  return (
    <div
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none",
        "[&_h2]:font-oswald [&_h2]:text-3xl [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:mt-10 [&_h2]:mb-4",
        "[&_h3]:font-oswald [&_h3]:text-xl [&_h3]:uppercase [&_h3]:tracking-wide [&_h3]:mt-8 [&_h3]:mb-3",
        "[&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p]:mb-6",
        "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ul]:text-muted-foreground",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-6 [&_ol]:text-muted-foreground",
        "[&_li]:mb-2",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground [&_blockquote]:my-8",
        "[&_strong]:text-foreground [&_strong]:font-bold",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
