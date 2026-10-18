"use client";

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

import { axiosInstance } from "@/lib/axios";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap/minimal-tiptap";
import { usePostData } from "@/hooks/use-post-data";
import { useUploadData } from "@/hooks/use-upload-data";
import { getDisplayImageUrl } from "@/lib/image-url";
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
  imageUrl: z.string().optional(),
});

export function AnnouncementCreateView() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "INFO",
      location: "",
      locationLink: "",
      content: "",
      imageUrl: "",
    },
  });

  const { mutate: createAnn, isPending: isSaving } = usePostData({
    url: "/announcements",
    invalidateKeys: [["announcements"]],
    successMessage: "Announcement created successfully!",
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
    createAnn({
      ...values,
      datetime: values.datetime.toISOString(),
      locationLink: values.locationLink || null,
      imageUrl: values.imageUrl || null,
    });
  };

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
            Create Announcement
          </h1>
          <p className="text-sm text-muted-foreground">
            Broadcast news, schedules, or events to members.
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
                              placeholder="https://maps.google.com/..."
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
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
                    Discard
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Publish
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
                              src={getDisplayImageUrl(field.value)}
                              alt="Banner"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => form.setValue("imageUrl", "")}
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
