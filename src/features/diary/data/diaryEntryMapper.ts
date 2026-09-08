import { isDiaryDateKey } from "@/features/diary/model/diaryDate";
import type { DiaryEntry } from "@/features/diary/model/diary.types";
import { isMoodId } from "@/features/mood/mood.types";

export interface DiaryEntryRow {
  id: string;
  entry_date: string;
  mood_id: string | null;
  short_text: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export function toDiaryEntry(row: DiaryEntryRow): DiaryEntry {
  if (!isDiaryDateKey(row.entry_date)) {
    throw new Error(`Invalid diary entry date in database: ${row.entry_date}`);
  }

  if (row.mood_id !== null && !isMoodId(row.mood_id)) {
    throw new Error(`Invalid mood id in database: ${row.mood_id}`);
  }

  return {
    id: row.id,
    entryDate: row.entry_date,
    moodId: row.mood_id,
    shortText: row.short_text,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toDiaryEntryRow(entry: DiaryEntry): DiaryEntryRow {
  return {
    id: entry.id,
    entry_date: entry.entryDate,
    mood_id: entry.moodId,
    short_text: entry.shortText,
    content: entry.content,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  };
}
