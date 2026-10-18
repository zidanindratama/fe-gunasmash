"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { BlogActions } from "./blog-actions";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { getDisplayImageUrl } from "@/lib/image-url";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  coverUrl?: string | null;
  published: boolean;
  createdAt: string;
};

export const blogColumns: ColumnDef<Blog>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-16 relative overflow-hidden rounded-md border border-border bg-muted flex items-center justify-center flex-shrink-0">
            {row.original.coverUrl ? (
              <Image
                src={getDisplayImageUrl(row.original.coverUrl)}
                alt={row.original.title}
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-sm line-clamp-1 max-w-[200px] md:max-w-[300px]">
              {row.getValue("title")}
            </span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              /{row.original.slug}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "published",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isPublished = row.getValue("published") as boolean;
      return (
        <Badge
          variant={isPublished ? "default" : "secondary"}
          className="text-[10px] px-2 py-0.5"
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <span className="text-sm text-muted-foreground">
          {date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <BlogActions blog={row.original} />,
  },
];
