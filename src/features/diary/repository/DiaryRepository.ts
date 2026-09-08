import type {
  DiaryDateKey,
  DiaryEntry,
  DiaryEntryId,
} from "@/features/diary/model/diary.types";
import type {
  DiaryPhoto,
  DiaryRecord,
} from "@/features/diary/model/diaryPhoto.types";

export interface DiaryRepository {
  getByDate(entryDate: DiaryDateKey): Promise<DiaryEntry | null>;
  getRecordByDate(entryDate: DiaryDateKey): Promise<DiaryRecord | null>;
  getRecordById(id: DiaryEntryId): Promise<DiaryRecord | null>;
  listRecordsByDateRange(
    startInclusive: DiaryDateKey,
    endExclusive: DiaryDateKey,
  ): Promise<DiaryRecord[]>;
  upsert(entry: DiaryEntry): Promise<void>;
  upsertRecord(entry: DiaryEntry, photo: DiaryPhoto | null): Promise<void>;
  deleteById(id: DiaryEntryId): Promise<DiaryRecord | null>;
}
