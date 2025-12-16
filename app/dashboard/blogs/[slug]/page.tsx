import { BlogEditView } from "@/components/dashboard/blogs/blog-edit-view";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BlogEditPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <div className="space-y-6">
      <BlogEditView slug={slug} />
    </div>
  );
}
