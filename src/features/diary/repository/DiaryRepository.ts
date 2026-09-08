import type {
  DiaryDateKey,
  DiaryEntry,
} from "@/features/diary/model/diary.types";

export interface DiaryRepository {
  getByDate(entryDate: DiaryDateKey): Promise<DiaryEntry | null>;
  upsert(entry: DiaryEntry): Promise<void>;
}
