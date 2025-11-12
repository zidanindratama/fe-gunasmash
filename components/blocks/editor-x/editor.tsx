"use client";

import * as React from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  CLEAR_HISTORY_COMMAND,
  EditorState,
  SerializedEditorState,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";

const baseConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

type EditorProps = {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState | string;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
};

function normalizeIncomingState(
  editorState?: EditorState,
  editorSerializedState?: SerializedEditorState | string
): string | null {
  if (editorSerializedState != null) {
    if (typeof editorSerializedState === "string") return editorSerializedState;
    try {
      return JSON.stringify(editorSerializedState);
    } catch {
      return null;
    }
  }
  if (editorState) {
    try {
      return JSON.stringify(editorState.toJSON());
    } catch {
      return null;
    }
  }
  return null;
}

function ApplyExternalState({ json }: { json: string | null }) {
  const [editor] = useLexicalComposerContext();
  const lastApplied = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!json) return;
    if (lastApplied.current === json) return;

    const next = editor.parseEditorState(json);
    editor.setEditorState(next);
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);

    lastApplied.current = json;
  }, [editor, json]);

  return null;
}

export function Editor({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
}: EditorProps) {
  const incomingJson = React.useMemo(
    () => normalizeIncomingState(editorState, editorSerializedState),
    [editorState, editorSerializedState]
  );

  const initialConfig = React.useMemo<InitialConfigType>(
    () => ({
      ...baseConfig,
      ...(incomingJson ? { editorState: incomingJson } : {}),
    }),
    [incomingJson]
  );

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer initialConfig={initialConfig}>
        <ApplyExternalState json={incomingJson} />

        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(state) => {
              onChange?.(state);
              try {
                onSerializedChange?.(state.toJSON() as SerializedEditorState);
              } catch {}
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
