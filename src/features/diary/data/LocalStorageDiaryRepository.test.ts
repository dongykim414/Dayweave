import { LocalStorageDiaryRepository } from "@/features/diary/data/LocalStorageDiaryRepository";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

const entry = {
  id: "entry-1",
  entryDate: "2026-09-08",
  moodId: "happy" as const,
  shortText: "좋은 하루",
  content: "산책도 하고 맛있게 먹었다.",
  createdAt: "2026-09-08T08:00:00.000Z",
  updatedAt: "2026-09-08T08:00:00.000Z",
};

const photo = {
  id: "photo-1",
  diaryEntryId: entry.id,
  localUri: "file:///diary/photos/photo-1.jpg",
  width: 1200,
  height: 900,
  createdAt: "2026-09-08T08:00:00.000Z",
};

describe("LocalStorageDiaryRepository", () => {
  it("persists and restores an entry for a date", async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageDiaryRepository(storage);

    await repository.upsert(entry);

    await expect(repository.getByDate(entry.entryDate)).resolves.toEqual(entry);
  });

  it("keeps one entry per date when saving again", async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageDiaryRepository(storage);

    await repository.upsert(entry);
    await repository.upsert({
      ...entry,
      moodId: "calm",
      shortText: "수정한 기록",
      updatedAt: "2026-09-08T09:00:00.000Z",
    });

    await expect(repository.getByDate(entry.entryDate)).resolves.toMatchObject({
      moodId: "calm",
      shortText: "수정한 기록",
    });
  });

  it("persists, replaces, and removes one photo with its diary", async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageDiaryRepository(storage);

    await repository.upsertRecord(entry, photo);
    await expect(repository.getRecordByDate(entry.entryDate)).resolves.toEqual({
      entry,
      photo,
    });

    const replacement = { ...photo, id: "photo-2" };
    await repository.upsertRecord(entry, replacement);
    await expect(repository.getRecordByDate(entry.entryDate)).resolves.toEqual({
      entry,
      photo: replacement,
    });

    await repository.upsertRecord(entry, null);
    await expect(repository.getRecordByDate(entry.entryDate)).resolves.toEqual({
      entry,
      photo: null,
    });
  });

  it("lists only records inside an inclusive-exclusive date range", async () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageDiaryRepository(storage);
    const previousMonth = {
      ...entry,
      id: "entry-august",
      entryDate: "2026-08-31",
    };
    const nextMonth = {
      ...entry,
      id: "entry-october",
      entryDate: "2026-10-01",
    };

    await repository.upsertRecord(previousMonth, null);
    await repository.upsertRecord(entry, photo);
    await repository.upsertRecord(nextMonth, null);

    await expect(
      repository.listRecordsByDateRange("2026-09-01", "2026-10-01"),
    ).resolves.toEqual([{ entry, photo }]);
  });

  it("rejects a reversed or empty date range", async () => {
    const repository = new LocalStorageDiaryRepository(new MemoryStorage());

    await expect(
      repository.listRecordsByDateRange("2026-09-01", "2026-09-01"),
    ).rejects.toThrow("exclusive end after its start");
  });
});
