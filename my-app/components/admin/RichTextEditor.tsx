"use client";

import { useEffect, useRef, type ChangeEvent } from "react";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
};

function sanitizeLink(url: string) {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("mailto:")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  helperText,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    if (editor.innerHTML !== value) {
      editor.innerHTML = value || "<p><br></p>";
    }
  }, [value]);

  const syncEditorValue = () => {
    const editor = editorRef.current;
    if (!editor) {
      return;
    }

    onChange(editor.innerHTML);
  };

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncEditorValue();
  };

  const handleHeadingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const heading = event.target.value;
    editorRef.current?.focus();

    if (heading === "normal") {
      document.execCommand("formatBlock", false, "p");
    } else {
      document.execCommand("formatBlock", false, heading);
    }

    syncEditorValue();
  };

  const handleLink = () => {
    const url = window.prompt("Enter a link URL");
    if (!url) {
      return;
    }

    const safeUrl = sanitizeLink(url);
    if (!safeUrl) {
      return;
    }

    editorRef.current?.focus();
    document.execCommand("createLink", false, safeUrl);
    syncEditorValue();
  };

  const handleClearFormatting = () => {
    editorRef.current?.focus();
    document.execCommand("removeFormat");
    document.execCommand("unlink");
    syncEditorValue();
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-zinc-900">{label}</label>
      {helperText && <p className="mb-2 text-xs text-zinc-500">{helperText}</p>}

      <div className="overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm">
        <div className="flex flex-wrap gap-1 border-b border-zinc-200 bg-zinc-50 p-2">
          <select
            defaultValue="normal"
            onChange={handleHeadingChange}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-800"
            aria-label="Text style"
          >
            <option value="normal">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <ToolbarButton label="Bold" onClick={() => runCommand("bold")} />
          <ToolbarButton label="Italic" onClick={() => runCommand("italic")} />
          <ToolbarButton label="Underline" onClick={() => runCommand("underline")} />
          <ToolbarButton label="Strike" onClick={() => runCommand("strikeThrough")} />
          <ToolbarButton label="Quote" onClick={() => runCommand("formatBlock", "blockquote")} />
          <ToolbarButton label="List" onClick={() => runCommand("insertUnorderedList")} />
          <ToolbarButton label="Numbered" onClick={() => runCommand("insertOrderedList")} />
          <ToolbarButton label="Link" onClick={handleLink} />
          <ToolbarButton label="Clear" onClick={handleClearFormatting} />
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          data-placeholder={placeholder || "Write content here..."}
          className="rich-text-editor min-h-[220px] px-4 py-3 text-sm leading-7 text-zinc-900 outline-none"
          onInput={syncEditorValue}
          onBlur={syncEditorValue}
        />
      </div>
    </div>
  );
}

type ToolbarButtonProps = {
  label: string;
  onClick: () => void;
};

function ToolbarButton({ label, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100"
    >
      {label}
    </button>
  );
}
