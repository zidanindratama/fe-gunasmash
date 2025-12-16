import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { Content, UseEditorOptions } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import { Typography } from "@tiptap/extension-typography";
import { TextStyle } from "@tiptap/extension-text-style";
import { Placeholder, Selection } from "@tiptap/extensions";
import {
  Image,
  HorizontalRule,
  CodeBlockLowlight,
  Color,
  UnsetAllMarks,
  ResetMarksOnEnter,
  FileHandler,
} from "../extensions";
import { cn } from "@/lib/utils";
import { fileToBase64, getOutput, randomId } from "../utils";
import { useThrottle } from "../hooks/use-throttle";
import { toast } from "sonner";

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content;
  output?: "html" | "json" | "text";
  placeholder?: string;
  editorClassName?: string;
  throttleDelay?: number;
  onUpdate?: (content: Content) => void;
  onBlur?: (content: Content) => void;
  uploader?: (file: File) => Promise<string>;
}

async function fakeuploader(file: File): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const src = await fileToBase64(file);
  return src;
}

const createExtensions = ({
  placeholder,
  uploader,
}: {
  placeholder: string;
  uploader?: (file: File) => Promise<string>;
}) => {
  const handleUpload = async (file: File): Promise<string> => {
    if (uploader) {
      return await uploader(file);
    }
    return await fakeuploader(file);
  };

  return [
    StarterKit.configure({
      blockquote: { HTMLAttributes: { class: "block-node" } },
      bulletList: { HTMLAttributes: { class: "list-node" } },
      code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
      codeBlock: false,
      dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
      heading: { HTMLAttributes: { class: "heading-node" } },
      horizontalRule: false,
      link: {
        enableClickSelection: true,
        openOnClick: false,
        HTMLAttributes: {
          class: "link",
        },
      },
      orderedList: { HTMLAttributes: { class: "list-node" } },
      paragraph: { HTMLAttributes: { class: "text-node" } },
    }),
    Image.configure({
      allowedMimeTypes: ["image/*"],
      maxFileSize: 5 * 1024 * 1024,
      allowBase64: true,
      // Use the helper function here
      uploadFn: handleUpload,
      onToggle(editor, files, pos) {
        editor.commands.insertContentAt(
          pos,
          files.map((image) => {
            const blobUrl = URL.createObjectURL(image);
            const id = randomId();

            return {
              type: "image",
              attrs: {
                id,
                src: blobUrl,
                alt: image.name,
                title: image.name,
                fileName: image.name,
              },
            };
          })
        );
      },
      onImageRemoved({ id, src }) {
        console.log("Image removed", { id, src });
      },
      onValidationError(errors) {
        errors.forEach((error) => {
          toast.error("Image validation error", {
            position: "bottom-right",
            description: error.reason,
          });
        });
      },
      onActionSuccess({ action }) {
        const mapping = {
          copyImage: "Copy Image",
          copyLink: "Copy Link",
          download: "Download",
        };
        toast.success(mapping[action], {
          position: "bottom-right",
          description: "Image action success",
        });
      },
      onActionError(error, { action }) {
        const mapping = {
          copyImage: "Copy Image",
          copyLink: "Copy Link",
          download: "Download",
        };
        toast.error(`Failed to ${mapping[action]}`, {
          position: "bottom-right",
          description: error.message,
        });
      },
    }),
    FileHandler.configure({
      allowBase64: true,
      allowedMimeTypes: ["image/*"],
      maxFileSize: 5 * 1024 * 1024,
      onDrop: async (editor, files, pos) => {
        for (const file of files) {
          try {
            // FIX: Use the uploader instead of just fileToBase64
            const src = await handleUpload(file);
            editor.commands.insertContentAt(pos, {
              type: "image",
              attrs: { src },
            });
          } catch (error) {
            toast.error("Failed to upload dropped image");
          }
        }
      },
      onPaste: async (editor, files) => {
        for (const file of files) {
          try {
            const src = await handleUpload(file);
            editor.commands.insertContent({
              type: "image",
              attrs: { src },
            });
          } catch (error) {
            toast.error("Failed to upload pasted image");
          }
        }
      },
      onValidationError: (errors) => {
        errors.forEach((error) => {
          toast.error("Image validation error", {
            position: "bottom-right",
            description: error.reason,
          });
        });
      },
    }),
    Color,
    TextStyle,
    Selection,
    Typography,
    UnsetAllMarks,
    HorizontalRule,
    ResetMarksOnEnter,
    CodeBlockLowlight,
    Placeholder.configure({ placeholder: () => placeholder }),
  ];
};

export const useMinimalTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  uploader,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay
  );

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  );

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value);
      }
    },
    [value]
  );

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur]
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: createExtensions({ placeholder, uploader }),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-hidden", editorClassName),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  });

  return editor;
};

export default useMinimalTiptapEditor;
