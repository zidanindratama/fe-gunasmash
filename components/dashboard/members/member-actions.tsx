"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Copy, Trash2, Eye, Loader2 } from "lucide-react";
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
import { Member } from "./member-columns";
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

interface MemberActionsProps {
  member: Member;
}

export function MemberActions({ member }: MemberActionsProps) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteMember, isPending } = useDeleteData({
    url: "/users",
    invalidateKeys: [["users"]],
    successMessage: "Member deleted successfully.",
    onSuccess: () => setOpen(false),
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(member.id);
    toast.success("Member ID copied to clipboard");
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

          <DropdownMenuItem onClick={handleCopyId} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4 text-blue-500" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/members/${member.id}`}
              className="cursor-pointer flex items-center w-full"
            >
              <Eye className="mr-2 h-4 w-4 text-primary" />
              View details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer group"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive group-hover:text-destructive" />
            Delete member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-bold text-foreground">{member.name}</span>{" "}
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                deleteMember(member.id);
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
