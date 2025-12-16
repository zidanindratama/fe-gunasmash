"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowLeft,
  Loader2,
  Save,
  X,
  UploadCloud,
  AlertCircle,
} from "lucide-react";
import { Content } from "@tiptap/react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { axiosInstance } from "@/lib/axios";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap/minimal-tiptap";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useUploadData } from "@/hooks/use-upload-data";

const TAG_OPTIONS: Option[] = [
  { label: "News", value: "news" },
  { label: "Tips & Tricks", value: "tips" },
  { label: "Tutorial", value: "tutorial" },
  { label: "Gear Review", value: "gear" },
  { label: "Match Recap", value: "recap" },
  { label: "Health", value: "health" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Story", value: "story" },
];

const tiptapImageUploader = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const { data } = await axiosInstance.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.url;
  } catch (error) {
    console.error("Image upload failed", error);
    toast.error("Failed to upload image inside editor.");
    throw error;
  }
};

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  coverUrl: z.string().optional().nullable(),
  tags: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  published: z.boolean(),
});

interface BlogDetailResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverUrl: string | null;
  tags: string[];
  published: boolean;
}

interface BlogEditViewProps {
  slug: string;
}

export function BlogEditView({ slug }: BlogEditViewProps) {
  const router = useRouter();

  const {
    data: blogData,
    isLoading: isLoadingData,
    isError: isErrorData,
  } = useGetData<BlogDetailResponse>({
    url: `/blogs/${slug}`,
    key: ["blog-detail", slug],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      coverUrl: "",
      tags: [],
      published: false,
    },
  });

  useEffect(() => {
    if (blogData) {
      const formattedTags = blogData.tags.map((tagStr) => {
        const foundOption = TAG_OPTIONS.find((opt) => opt.value === tagStr);
        return foundOption || { label: tagStr, value: tagStr };
      });

      form.reset({
        title: blogData.title,
        content: blogData.content,
        coverUrl: blogData.coverUrl,
        published: blogData.published,
        tags: formattedTags,
      });
    }
  }, [blogData, form]);

  const { mutate: updateBlog, isPending: isSaving } = usePatchData({
    url: `/blogs/${slug}`,
    invalidateKeys: [["blogs"], ["blog-detail", slug]],
    successMessage: "Blog post updated successfully!",
    onSuccess: () => {
      router.push("/dashboard/blogs");
    },
  });

  const { mutate: uploadCover, isPending: isUploadingCover } = useUploadData({
    url: "/uploads/image",
    onSuccess: (data: any) => {
      form.setValue("coverUrl", data.url);
      toast.success("Cover image uploaded.");
    },
  });

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadCover(formData);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tagsArray = values.tags?.map((t) => t.value) || [];

    updateBlog({
      data: {
        title: values.title,
        content: values.content,
        published: values.published,
        coverUrl: values.coverUrl || null,
        tags: tagsArray,
      },
    });
  };

  if (isLoadingData) {
    return <BlogEditSkeleton />;
  }

  if (isErrorData || !blogData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch blog post data. It might not exist or there was a
          network error.
        </AlertDescription>
        <Button
          variant="outline"
          className="mt-4 border-destructive/50"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </Alert>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-oswald text-2xl font-bold uppercase tracking-wide">
            Edit Blog Post
          </h1>
          <p className="text-sm text-muted-foreground">
            Make changes to your existing article.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-8 md:grid-cols-[1fr_300px]"
        >
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter blog title..."
                          className="text-lg font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={field.value as Content}
                          onChange={field.onChange}
                          className="w-full border rounded-md min-h-[400px]"
                          editorContentClassName="p-5 prose dark:prose-invert max-w-none min-h-[400px]"
                          output="html"
                          placeholder="Start writing your story..."
                          editable={true}
                          editorClassName="focus:outline-hidden"
                          throttleDelay={1000}
                          uploader={tiptapImageUploader}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Published</FormLabel>
                        <FormDescription className="text-xs">
                          Make this post visible to public.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Update Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cover Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="coverUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center overflow-hidden hover:bg-muted/80 transition-colors">
                        {field.value ? (
                          <>
                            <Image
                              src={field.value}
                              alt="Cover"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => form.setValue("coverUrl", null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            {isUploadingCover ? (
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            ) : (
                              <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            )}
                            <p className="text-xs text-muted-foreground">
                              Click to upload cover image
                            </p>
                          </div>
                        )}

                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleCoverUpload}
                          disabled={isUploadingCover}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          defaultOptions={TAG_OPTIONS}
                          placeholder="Select tags..."
                          creatable
                          emptyIndicator={
                            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                              No tags found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}

function BlogEditSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <Skeleton className="h-[600px] w-full rounded-xl" />
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[150px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
