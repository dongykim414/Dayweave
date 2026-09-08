import type { SQLiteDatabase } from "expo-sqlite";

import {
  toDiaryEntry,
  type DiaryEntryRow,
} from "@/features/diary/data/diaryEntryMapper";
import {
  toDiaryPhoto,
  type DiaryPhotoRow,
} from "@/features/diary/data/diaryPhotoMapper";
import type {
  DiaryDateKey,
  DiaryEntry,
  DiaryEntryId,
} from "@/features/diary/model/diary.types";
import type {
  DiaryPhoto,
  DiaryRecord,
} from "@/features/diary/model/diaryPhoto.types";
import type { DiaryRepository } from "@/features/diary/repository/DiaryRepository";

interface DiaryRecordRow extends DiaryEntryRow {
  photo_id: string | null;
  photo_diary_entry_id: string | null;
  photo_local_uri: string | null;
  photo_width: number | null;
  photo_height: number | null;
  photo_created_at: string | null;
}

function toDiaryRecord(row: DiaryRecordRow): DiaryRecord {
  let photoRow: DiaryPhotoRow | null = null;

  if (row.photo_id) {
    if (
      !row.photo_diary_entry_id ||
      !row.photo_local_uri ||
      row.photo_width === null ||
      row.photo_height === null ||
      !row.photo_created_at
    ) {
      throw new Error("Diary photo row contains incomplete metadata");
    }

    photoRow = {
      id: row.photo_id,
      diary_entry_id: row.photo_diary_entry_id,
      local_uri: row.photo_local_uri,
      width: row.photo_width,
      height: row.photo_height,
      created_at: row.photo_created_at,
    };
  }

  return {
    entry: toDiaryEntry(row),
    photo: photoRow ? toDiaryPhoto(photoRow) : null,
  };
}

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

  async getRecordByDate(entryDate: DiaryDateKey): Promise<DiaryRecord | null> {
    const row = await this.database.getFirstAsync<DiaryRecordRow>(
      `SELECT
        entries.id,
        entries.entry_date,
        entries.mood_id,
        entries.short_text,
        entries.content,
        entries.created_at,
        entries.updated_at,
        photos.id AS photo_id,
        photos.diary_entry_id AS photo_diary_entry_id,
        photos.local_uri AS photo_local_uri,
        photos.width AS photo_width,
        photos.height AS photo_height,
        photos.created_at AS photo_created_at
      FROM diary_entries AS entries
      LEFT JOIN diary_photos AS photos
        ON photos.diary_entry_id = entries.id
      WHERE entries.entry_date = ?
      LIMIT 1`,
      entryDate,
    );

    if (!row) {
      return null;
    }

    return toDiaryRecord(row);
  }

  async getRecordById(id: DiaryEntryId): Promise<DiaryRecord | null> {
    const row = await this.database.getFirstAsync<DiaryRecordRow>(
      `SELECT
        entries.id,
        entries.entry_date,
        entries.mood_id,
        entries.short_text,
        entries.content,
        entries.created_at,
        entries.updated_at,
        photos.id AS photo_id,
        photos.diary_entry_id AS photo_diary_entry_id,
        photos.local_uri AS photo_local_uri,
        photos.width AS photo_width,
        photos.height AS photo_height,
        photos.created_at AS photo_created_at
      FROM diary_entries AS entries
      LEFT JOIN diary_photos AS photos
        ON photos.diary_entry_id = entries.id
      WHERE entries.id = ?
      LIMIT 1`,
      id,
    );

    return row ? toDiaryRecord(row) : null;
  }

  async listRecordsByDateRange(
    startInclusive: DiaryDateKey,
    endExclusive: DiaryDateKey,
  ): Promise<DiaryRecord[]> {
    if (startInclusive >= endExclusive) {
      throw new Error("Diary date range must have an exclusive end after its start");
    }

    const rows = await this.database.getAllAsync<DiaryRecordRow>(
      `SELECT
        entries.id,
        entries.entry_date,
        entries.mood_id,
        entries.short_text,
        entries.content,
        entries.created_at,
        entries.updated_at,
        photos.id AS photo_id,
        photos.diary_entry_id AS photo_diary_entry_id,
        photos.local_uri AS photo_local_uri,
        photos.width AS photo_width,
        photos.height AS photo_height,
        photos.created_at AS photo_created_at
      FROM diary_entries AS entries
      LEFT JOIN diary_photos AS photos
        ON photos.diary_entry_id = entries.id
      WHERE entries.entry_date >= ?
        AND entries.entry_date < ?
      ORDER BY entries.entry_date ASC`,
      startInclusive,
      endExclusive,
    );

    return rows.map(toDiaryRecord);
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

  async upsertRecord(
    entry: DiaryEntry,
    photo: DiaryPhoto | null,
  ): Promise<void> {
    await this.database.withTransactionAsync(async () => {
      await this.upsert(entry);

      if (!photo) {
        await this.database.runAsync(
          "DELETE FROM diary_photos WHERE diary_entry_id = ?",
          entry.id,
        );
        return;
      }

      await this.database.runAsync(
        `INSERT INTO diary_photos (
          id,
          diary_entry_id,
          local_uri,
          width,
          height,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(diary_entry_id) DO UPDATE SET
          id = excluded.id,
          local_uri = excluded.local_uri,
          width = excluded.width,
          height = excluded.height,
          created_at = excluded.created_at`,
        photo.id,
        entry.id,
        photo.localUri,
        photo.width,
        photo.height,
        photo.createdAt,
      );
    });
  }

  async deleteById(id: DiaryEntryId): Promise<DiaryRecord | null> {
    let deletedRecord: DiaryRecord | null = null;

    await this.database.withTransactionAsync(async () => {
      deletedRecord = await this.getRecordById(id);

      if (deletedRecord) {
        await this.database.runAsync(
          "DELETE FROM diary_entries WHERE id = ?",
          id,
        );
      }
    });

    return deletedRecord;
  }
}
