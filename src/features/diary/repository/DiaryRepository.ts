import type {
  DiaryDateKey,
  DiaryEntry,
} from "@/features/diary/model/diary.types";
import type {
  DiaryPhoto,
  DiaryRecord,
} from "@/features/diary/model/diaryPhoto.types";

export interface DiaryRepository {
  getByDate(entryDate: DiaryDateKey): Promise<DiaryEntry | null>;
  getRecordByDate(entryDate: DiaryDateKey): Promise<DiaryRecord | null>;
  upsert(entry: DiaryEntry): Promise<void>;
  upsertRecord(entry: DiaryEntry, photo: DiaryPhoto | null): Promise<void>;
}
