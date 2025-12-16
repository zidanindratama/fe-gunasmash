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
  MapPin,
  Link as LinkIcon,
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { axiosInstance } from "@/lib/axios";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap/minimal-tiptap";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { useUploadData } from "@/hooks/use-upload-data";
import { DateTimePicker } from "@/components/ui/date-time-picker";

const ANNOUNCEMENT_TYPES = [
  "TRAINING",
  "SPARRING",
  "TOURNAMENT",
  "BRIEFING",
  "RECRUITMENT",
  "EVENT",
  "INFO",
] as const;

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
  type: z.enum(ANNOUNCEMENT_TYPES, {
    error: () => ({ message: "Please select an announcement type." }),
  }),
  datetime: z.date({
    error: "Date and time is required.",
  }),
  location: z.string().min(3, "Location is required."),
  locationLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  content: z.string().min(10, "Content must be at least 10 characters."),
  imageUrl: z.string().optional().nullable(),
});

interface AnnouncementDetailResponse {
  id: string;
  title: string;
  type: (typeof ANNOUNCEMENT_TYPES)[number];
  datetime: string;
  location: string;
  locationLink: string | null;
  content: string;
  imageUrl: string | null;
}

interface AnnouncementEditViewProps {
  id: string;
}

export function AnnouncementEditView({ id }: AnnouncementEditViewProps) {
  const router = useRouter();

  const {
    data: annData,
    isLoading: isLoadingData,
    isError: isErrorData,
  } = useGetData<AnnouncementDetailResponse>({
    url: `/announcements/${id}`,
    key: ["announcement-detail", id],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "INFO",
      location: "",
      locationLink: "",
      content: "",
      imageUrl: null,
    },
  });

  useEffect(() => {
    if (annData) {
      form.reset({
        title: annData.title,
        type: annData.type,
        datetime: annData.datetime ? new Date(annData.datetime) : undefined,
        location: annData.location,
        locationLink: annData.locationLink || "",
        content: annData.content,
        imageUrl: annData.imageUrl,
      });
    }
  }, [annData, form]);

  const { mutate: updateAnn, isPending: isSaving } = usePatchData({
    url: `/announcements/${id}`,
    invalidateKeys: [["announcements"], ["announcement-detail", id]],
    successMessage: "Announcement updated successfully!",
    onSuccess: () => {
      router.push("/dashboard/announcements");
    },
  });

  const { mutate: uploadImage, isPending: isUploading } = useUploadData({
    url: "/uploads/image",
    onSuccess: (data: any) => {
      form.setValue("imageUrl", data.url);
      toast.success("Image uploaded.");
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadImage(formData);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateAnn({
      data: {
        title: values.title,
        type: values.type,
        datetime: values.datetime.toISOString(),
        location: values.location,
        locationLink: values.locationLink || null,
        content: values.content,
        imageUrl: values.imageUrl || null,
      },
    });
  };

  if (isLoadingData) {
    return <AnnouncementEditSkeleton />;
  }

  if (isErrorData || !annData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch announcement data. It might not exist or there was a
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
            Edit Announcement
          </h1>
          <p className="text-sm text-muted-foreground">
            Update details for this announcement.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-8 md:grid-cols-[1fr_350px]"
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
                          placeholder="e.g. Weekly Sparring Session"
                          className="text-lg font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="GOR Gunadarma"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maps Link (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder="http://googleusercontent.com/maps..."
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Details</FormLabel>
                      <FormControl>
                        <MinimalTiptapEditor
                          value={field.value as Content}
                          onChange={field.onChange}
                          className="w-full border rounded-md min-h-[300px]"
                          editorContentClassName="p-5 prose dark:prose-invert max-w-none min-h-[300px]"
                          output="html"
                          placeholder="Write the details here..."
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
                <CardTitle className="text-base">Schedule & Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Type</FormLabel>
                      <Select
                        key={field.value}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ANNOUNCEMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.charAt(0) + type.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="datetime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date & Time</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          key={annData ? "loaded" : "loading"}
                          value={field.value}
                          onChange={field.onChange}
                          hourCycle={24}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
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
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Banner Image</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center overflow-hidden hover:bg-muted/80 transition-colors">
                        {field.value ? (
                          <>
                            <Image
                              src={field.value}
                              alt="Banner"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => form.setValue("imageUrl", null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            {isUploading ? (
                              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                            ) : (
                              <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            )}
                            <p className="text-xs text-muted-foreground">
                              Upload banner (Optional)
                            </p>
                          </div>
                        )}

                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </div>
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

function AnnouncementEditSkeleton() {
  return (
    <div className="max-w-5xl mx-auto pb-10 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
