import type { MoodId } from "@/features/mood/mood.types";

export type DiaryEntryId = string;
export type DiaryDateKey = string;

export interface DiaryEntry {
  id: DiaryEntryId;
  entryDate: DiaryDateKey;
  moodId: MoodId | null;
  shortText: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryDraft {
  moodId: MoodId | null;
  shortText: string;
  content: string;
}
