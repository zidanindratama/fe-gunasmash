"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { AnnouncementActions } from "./announcement-actions";
import { MapPin, Calendar } from "lucide-react";

export type Announcement = {
  id: string;
  title: string;
  type:
    | "TRAINING"
    | "SPARRING"
    | "TOURNAMENT"
    | "BRIEFING"
    | "RECRUITMENT"
    | "EVENT"
    | "INFO";
  datetime: string;
  location: string;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "TRAINING":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "SPARRING":
      return "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20";
    case "TOURNAMENT":
      return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20";
    case "EVENT":
      return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20";
    case "BRIEFING":
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "RECRUITMENT":
      return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20";
    case "INFO":
      return "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

export const announcementColumns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm line-clamp-1 max-w-[300px]">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant="outline"
          className={`text-[10px] px-2 py-0.5 border ${getTypeColor(type)}`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("datetime"));
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {date.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate max-w-[150px]">
            {row.getValue("location")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AnnouncementActions announcement={row.original} />,
  },
];
