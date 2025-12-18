"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Copy,
  Trash2,
  Pencil,
  Eye,
  Loader2,
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
import { Blog } from "./blog-columns";
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

interface BlogActionsProps {
  blog: Blog;
}

export function BlogActions({ blog }: BlogActionsProps) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteBlog, isPending } = useDeleteData({
    url: `/blogs`,
    invalidateKeys: [["blogs"]],
    successMessage: "Blog post deleted successfully.",
    onSuccess: () => setOpen(false),
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(blog.slug);
    toast.success("Blog Slug copied to clipboard");
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
            Copy Slug
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/blogs/${blog.slug}`}
              className="cursor-pointer flex items-center w-full"
            >
              <Pencil className="mr-2 h-4 w-4 text-primary" />
              Edit details
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer group"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4 text-destructive group-hover:text-destructive" />
            Delete blog
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post{" "}
              <span className="font-bold text-foreground">"{blog.title}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                deleteBlog(blog.slug);
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
