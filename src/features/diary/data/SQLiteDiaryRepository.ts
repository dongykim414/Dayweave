import type { SQLiteDatabase } from "expo-sqlite";

import {
  toDiaryEntry,
  type DiaryEntryRow,
} from "@/features/diary/data/diaryEntryMapper";
import type {
  DiaryDateKey,
  DiaryEntry,
} from "@/features/diary/model/diary.types";
import type { DiaryRepository } from "@/features/diary/repository/DiaryRepository";

export class SQLiteDiaryRepository implements DiaryRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getByDate(entryDate: DiaryDateKey): Promise<DiaryEntry | null> {
    const row = await this.database.getFirstAsync<DiaryEntryRow>(
      `SELECT
        id,
        entry_date,
        mood_id,
        short_text,
        content,
        created_at,
        updated_at
      FROM diary_entries
      WHERE entry_date = ?
      LIMIT 1`,
      entryDate,
    );

    return row ? toDiaryEntry(row) : null;
  }

  async upsert(entry: DiaryEntry): Promise<void> {
    await this.database.runAsync(
      `INSERT INTO diary_entries (
        id,
        entry_date,
        mood_id,
        short_text,
        content,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(entry_date) DO UPDATE SET
        mood_id = excluded.mood_id,
        short_text = excluded.short_text,
        content = excluded.content,
        updated_at = excluded.updated_at`,
      entry.id,
      entry.entryDate,
      entry.moodId,
      entry.shortText,
      entry.content,
      entry.createdAt,
      entry.updatedAt,
    );
  }
}
