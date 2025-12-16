"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { SessionActions } from "./session-actions";
import { Calendar, Clock } from "lucide-react";

export type Session = {
  id: string;
  announcementId: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  status: "OPEN" | "CLOSED";
  _count: {
    attendances: number;
  };
};

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Session Name" />
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Schedule" />
    ),
    cell: ({ row }) => {
      const dateOnly = new Date(row.getValue("date"));
      const dateStr = format(dateOnly, "EEEE, d MMM yyyy", { locale: id });

      const timeSource =
        row.original.startTime || (row.getValue("date") as string);

      const dateTime = new Date(timeSource);
      const timeStr = format(dateTime, "HH:mm 'WIB'");

      return (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium text-foreground">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground ml-[2px]">
            <Clock className="h-3 w-3" />
            <span className="font-mono">{timeStr}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "OPEN" ? "default" : "secondary"}
          className={
            status === "OPEN"
              ? "bg-green-500/15 text-green-600 hover:bg-green-500/25 border-green-500/20"
              : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "_count.attendances",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendees" />
    ),
    cell: ({ row }) => {
      const count = row.original._count.attendances;
      return (
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium">{count}</span>
          <span className="text-xs text-muted-foreground">Members</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <SessionActions session={row.original} />,
  },
];
