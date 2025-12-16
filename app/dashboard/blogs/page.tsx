import { BlogDataTable } from "@/components/dashboard/blogs/blog-datatable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function BlogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-3xl font-bold uppercase tracking-wide">
            Blogs
          </h1>
          <p className="text-muted-foreground">
            Manage your articles, news, and updates.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/create">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Link>
        </Button>
      </div>

      <BlogDataTable />
    </div>
  );
}
