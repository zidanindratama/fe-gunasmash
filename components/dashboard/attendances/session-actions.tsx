"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Copy,
  Trash2,
  Eye,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDeleteData } from "@/hooks/use-delete-data";
import { Session } from "./session-columns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionActionsProps {
  session: Session;
}

export function SessionActions({ session }: SessionActionsProps) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteSession, isPending } = useDeleteData({
    url: "/attendances",
    invalidateKeys: [["sessions"]],
    successMessage: "Attendance Session deleted successfully.",
    onSuccess: () => setOpen(false),
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(session.id);
    toast.success("Session ID copied to clipboard");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/attendances/${session.id}`}
              className="cursor-pointer flex items-center w-full"
            >
              <Eye className="mr-2 h-4 w-4 text-primary" />
              Manage Attendance
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/attendances/${session.id}/edit`}
              className="cursor-pointer flex items-center w-full"
            >
              <Pencil className="mr-2 h-4 w-4 text-primary" />
              Edit Details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCopyId} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4 text-blue-500" />
            Copy Session ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer group"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive group-hover:text-destructive" />
            Delete Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              session{" "}
              <span className="font-bold text-foreground">
                "{session.title}"
              </span>
              , all associated attendance logs, and the original Announcement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                deleteSession(session.id);
              }}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
