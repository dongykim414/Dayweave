import type {
  DiaryDateKey,
  DiaryEntry,
} from "@/features/diary/model/diary.types";
import type { DiaryRepository } from "@/features/diary/repository/DiaryRepository";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const WEB_DIARY_STORAGE_KEY = "dayweave:diary-entries:v1";

function getBrowserStorage(): StorageLike {
  if (typeof window === "undefined") {
    throw new Error("Web diary storage is only available in a browser");
  }

  return window.localStorage;
}

function parseEntries(rawEntries: string | null): Record<string, DiaryEntry> {
  if (!rawEntries) {
    return {};
  }

  try {
    return JSON.parse(rawEntries) as Record<string, DiaryEntry>;
  } catch {
    throw new Error("Web diary storage contains invalid data");
  }
}

/**
 * TODO(web-storage): This is a browser-only preview adapter for M1.
 * Replace it with IndexedDB or synced storage when Web becomes a product target.
 * Android and iOS continue to use SQLiteDiaryRepository.
 */
export class LocalStorageDiaryRepository implements DiaryRepository {
  constructor(private readonly storage: StorageLike = getBrowserStorage()) {}

  async getByDate(entryDate: DiaryDateKey): Promise<DiaryEntry | null> {
    const entries = parseEntries(this.storage.getItem(WEB_DIARY_STORAGE_KEY));

    return entries[entryDate] ?? null;
  }

  async upsert(entry: DiaryEntry): Promise<void> {
    const entries = parseEntries(this.storage.getItem(WEB_DIARY_STORAGE_KEY));

    this.storage.setItem(
      WEB_DIARY_STORAGE_KEY,
      JSON.stringify({ ...entries, [entry.entryDate]: entry }),
    );
  }
}
