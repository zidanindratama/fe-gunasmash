"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { SerializedEditorState } from "lexical";
import api from "@/lib/axios-instance";
import { Editor } from "@/components/blocks/editor-x/editor";
import { toast } from "sonner";
import { X, Plus, Save, Upload, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useUploadImage } from "@/hooks/use-upload-image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(3),
  coverUrl: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  content: z.string().min(1),
});

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type FormValues = z.input<typeof schema>;

export default function BlogCreateForm() {
  const router = useRouter();
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const { upload, isUploading, progress, reset } = useUploadImage();
  const [editorState, setEditorState] =
    React.useState<SerializedEditorState>(initialValue);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      coverUrl: "",
      published: false,
      tags: [],
      content: JSON.stringify(initialValue),
    },
  });

  const coverUrl = watch("coverUrl");
  const published = watch("published");
  const tags = watch("tags") || [];
  const [tagInput, setTagInput] = React.useState("");

  function addTagFromInput() {
    const v = tagInput.trim();
    if (!v) return;
    if (tags.includes(v)) {
      setTagInput("");
      return;
    }
    setValue("tags", [...tags, v], { shouldValidate: true, shouldDirty: true });
    setTagInput("");
  }

  function removeTag(v: string) {
    setValue(
      "tags",
      tags.filter((x: string) => x !== v),
      { shouldValidate: true, shouldDirty: true }
    );
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const out = await upload(f);
      setValue("coverUrl", out.url, {
        shouldValidate: true,
        shouldDirty: true,
      });
      toast.success("Gambar berhasil diunggah");
    } catch {
      toast.error("Gagal mengunggah gambar");
    }
  }

  React.useEffect(() => {
    setValue("content", JSON.stringify(editorState), {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [editorState, setValue]);

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        title: values.title,
        slug: slugify(values.title),
        coverUrl: values.coverUrl || null,
        published: values.published ?? false,
        tags: values.tags ?? [],
        content: values.content,
      };
      const res = await api.post("/api/blogs", payload);
      if (!("data" in res)) throw new Error("error");
      toast.success(
        values.published ?? false ? "Blog dipublikasikan" : "Draft disimpan"
      );
      router.push("/dashboard/blogs");
    } catch {
      toast.error("Gagal menyimpan blog");
    }
  }

  function submitWithPublishState(nextPublished: boolean) {
    setValue("published", nextPublished, { shouldValidate: true });
    handleSubmit(onSubmit)();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Buat Blog Baru</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tulis artikel baru untuk dibagikan kepada komunitas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 rounded-3xl border bg-card">
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input
                id="title"
                placeholder="Judul artikel"
                {...register("title")}
              />
            </div>
            <div className="space-y-2">
              <Label>Konten</Label>
              <div className="max-w-full overflow-x-auto rounded-xl border">
                <Editor
                  editorSerializedState={editorState}
                  onSerializedChange={setEditorState}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="rounded-3xl border bg-card p-6">
            <div className="space-y-2">
              <Label>Sampul</Label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPickFile}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Unggah Gambar
                </Button>
                <div className="min-w-0 grow">
                  <Input
                    placeholder="atau tempel URL gambar"
                    {...register("coverUrl")}
                  />
                </div>
                {coverUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setValue("coverUrl", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      reset();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
              {isUploading ? (
                <div className="mt-3">
                  <Progress value={progress} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {progress}%
                  </p>
                </div>
              ) : null}
              {coverUrl ? (
                <div className="mt-3 overflow-hidden rounded-xl">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={coverUrl}
                      alt="Cover"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 360px, 100vw"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="space-y-2">
              <Label>Tag</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t: string) => (
                  <Badge key={t} variant="secondary" className="pr-1">
                    <span className="mr-1">{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="inline-flex h-4 w-4 items-center justify-center rounded"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTagFromInput();
                    }
                  }}
                  placeholder="Tambah tag lalu Enter"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addTagFromInput}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Publikasikan</Label>
                <p className="text-xs text-muted-foreground">
                  Aktifkan untuk langsung mempublikasikan.
                </p>
              </div>
              <Controller
                control={control}
                name="published"
                render={({ field }) => (
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="sticky bottom-4 rounded-2xl border bg-background/80 p-3 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => submitWithPublishState(false)}
              >
                <Save className="mr-2 h-4 w-4" />
                Simpan Draft
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={() => submitWithPublishState(!!published)}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Publikasikan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
