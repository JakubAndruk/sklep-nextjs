"use client";

import { useState, useCallback } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const NOTE_DEBOUNCE_MS = 600;

type NoteEditorProps = {
  itemId: string;
  initialNote: string;
  onSave: (itemId: string, note: string) => Promise<void>;
};

export function NoteEditor({ itemId, initialNote, onSave }: NoteEditorProps) {
  const [note, setNote] = useState(initialNote);

  const debouncedSave = useDebouncedCallback((value: string) => {
    onSave(itemId, value).catch(() => {});
  }, NOTE_DEBOUNCE_MS);

  const handleChange = useCallback(
    (value: string) => {
      setNote(value);
      debouncedSave(value);
    },
    [debouncedSave],
  );

  return (
    <input
      type="text"
      value={note}
      onChange={(e) => handleChange(e.target.value)}
      placeholder="Add a note for this item..."
      maxLength={280}
      className="self-stretch px-4 py-2 bg-gray-50 rounded-md outline-1 outline-gray-200 text-neutral-900 text-sm font-normal placeholder:text-neutral-500 focus:outline-2 focus:outline-primary-500 transition-colors"
    />
  );
}
