import Blogs from "@/components/main/blogs/blogs";
import { Suspense } from "react";

export default function BlogPage() {
  return (
    <>
      <Suspense>
        <Blogs />
      </Suspense>
    </>
  );
}
