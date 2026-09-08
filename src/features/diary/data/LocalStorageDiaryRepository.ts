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

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const WEB_DIARY_STORAGE_KEY = "dayweave:diary-entries:v1";
const WEB_DIARY_PHOTO_STORAGE_KEY = "dayweave:diary-photos:v1";

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

function parsePhotos(rawPhotos: string | null): Record<string, DiaryPhoto> {
  if (!rawPhotos) {
    return {};
  }

  try {
    return JSON.parse(rawPhotos) as Record<string, DiaryPhoto>;
  } catch {
    throw new Error("Web diary photo storage contains invalid data");
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

  async getRecordByDate(entryDate: DiaryDateKey): Promise<DiaryRecord | null> {
    const entry = await this.getByDate(entryDate);

    if (!entry) {
      return null;
    }

    const photos = parsePhotos(
      this.storage.getItem(WEB_DIARY_PHOTO_STORAGE_KEY),
    );

    return { entry, photo: photos[entry.id] ?? null };
  }

  async getRecordById(id: DiaryEntryId): Promise<DiaryRecord | null> {
    const entries = parseEntries(this.storage.getItem(WEB_DIARY_STORAGE_KEY));
    const entry = Object.values(entries).find((candidate) => candidate.id === id);

    if (!entry) {
      return null;
    }

    const photos = parsePhotos(
      this.storage.getItem(WEB_DIARY_PHOTO_STORAGE_KEY),
    );

    return { entry, photo: photos[id] ?? null };
  }

  async listRecordsByDateRange(
    startInclusive: DiaryDateKey,
    endExclusive: DiaryDateKey,
  ): Promise<DiaryRecord[]> {
    if (startInclusive >= endExclusive) {
      throw new Error("Diary date range must have an exclusive end after its start");
    }

    const entries = parseEntries(this.storage.getItem(WEB_DIARY_STORAGE_KEY));
    const photos = parsePhotos(
      this.storage.getItem(WEB_DIARY_PHOTO_STORAGE_KEY),
    );

    return Object.values(entries)
      .filter(
        (entry) =>
          entry.entryDate >= startInclusive && entry.entryDate < endExclusive,
      )
      .sort((left, right) => left.entryDate.localeCompare(right.entryDate))
      .map((entry) => ({ entry, photo: photos[entry.id] ?? null }));
  }

  async upsert(entry: DiaryEntry): Promise<void> {
    const entries = parseEntries(this.storage.getItem(WEB_DIARY_STORAGE_KEY));

    this.storage.setItem(
      WEB_DIARY_STORAGE_KEY,
      JSON.stringify({ ...entries, [entry.entryDate]: entry }),
    );
  }

  async upsertRecord(
    entry: DiaryEntry,
    photo: DiaryPhoto | null,
  ): Promise<void> {
    await this.upsert(entry);
    const photos = parsePhotos(
      this.storage.getItem(WEB_DIARY_PHOTO_STORAGE_KEY),
    );

    if (photo) {
      photos[entry.id] = photo;
    } else {
      delete photos[entry.id];
    }

    this.storage.setItem(WEB_DIARY_PHOTO_STORAGE_KEY, JSON.stringify(photos));
  }

  async deleteById(id: DiaryEntryId): Promise<DiaryRecord | null> {
    const entries = parseEntries(this.storage.getItem(WEB_DIARY_STORAGE_KEY));
    const entry = Object.values(entries).find((candidate) => candidate.id === id);

    if (!entry) {
      return null;
    }

    const photos = parsePhotos(
      this.storage.getItem(WEB_DIARY_PHOTO_STORAGE_KEY),
    );
    const record = { entry, photo: photos[id] ?? null };

    delete entries[entry.entryDate];
    delete photos[id];
    this.storage.setItem(WEB_DIARY_STORAGE_KEY, JSON.stringify(entries));
    this.storage.setItem(WEB_DIARY_PHOTO_STORAGE_KEY, JSON.stringify(photos));

    return record;
  }
}
