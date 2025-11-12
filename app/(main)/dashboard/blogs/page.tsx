import BlogDatatable from "@/components/main/dashboard/blogs/blog-data-table";
import { Suspense } from "react";

export default function DashboardBlogPage() {
  return (
    <>
      <Suspense>
        <BlogDatatable />
      </Suspense>
    </>
  );
}
