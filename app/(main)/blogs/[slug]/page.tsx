import { BlogDetailView } from "@/components/main/blogs/blog-detail-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return <BlogDetailView slug={slug} />;
}
