import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Typography } from "@/components";
import { EditorWrapper } from "./QuilWrapper";

interface SnowTiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export const SnowTiptapEditor: React.FC<SnowTiptapEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  placeholder = "Start writing your document content...",
}) => {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="p-4 text-center">
        <Typography variant="p-m">Loading editor...</Typography>
      </div>
    );
  }

  return (
    <EditorWrapper>
      <EditorContent
        editor={editor}
        className="min-h-[150px]"
        placeholder={placeholder}
      />
    </EditorWrapper>
  );
};
