"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <Badge variant="secondary" className="mb-3">
          {eyebrow}
        </Badge>
      ) : null}
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
