import { BlogDetail } from "@/components/main/blogs/blog-detail";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <BlogDetail id={id} />
    </>
  );
}
