import type { DiaryRepository } from "@/features/diary/repository/DiaryRepository";
import {
  deleteDiaryRecord,
  discardDiaryPhotoDraft,
  saveDiaryRecord,
} from "@/features/diary/services/diaryRecordLifecycle";

const entry = {
  id: "entry-1",
  entryDate: "2026-09-09",
  moodId: "calm" as const,
  shortText: "수정한 하루",
  content: "내용",
  createdAt: "2026-09-09T00:00:00.000Z",
  updatedAt: "2026-09-09T01:00:00.000Z",
};

const previousPhoto = {
  id: "photo-a",
  diaryEntryId: entry.id,
  localUri: "file:///photo-a.jpg",
  width: 1200,
  height: 900,
  createdAt: entry.createdAt,
};

const preparedPhoto = {
  id: "photo-b",
  previewUri: "file:///cache/photo-b.jpg",
  width: 1200,
  height: 900,
  createdAt: entry.updatedAt,
};

const nextPhoto = {
  ...previousPhoto,
  id: preparedPhoto.id,
  localUri: "file:///photo-b.jpg",
  createdAt: preparedPhoto.createdAt,
};

function createRepository(overrides: Partial<DiaryRepository> = {}) {
  return {
    deleteById: async () => null,
    getByDate: async () => null,
    getRecordByDate: async () => null,
    getRecordById: async () => null,
    listRecordsByDateRange: async () => [],
    upsert: async () => undefined,
    upsertRecord: async () => undefined,
    ...overrides,
  } satisfies DiaryRepository;
}

describe("diary record lifecycle", () => {
  it("discards only an unsaved prepared photo on cancel", async () => {
    const discardedIds: string[] = [];
    const files = {
      deletePersisted: async () => undefined,
      discardPrepared: async (photo: typeof preparedPhoto) => {
        discardedIds.push(photo.id);
      },
      persistPrepared: async () => nextPhoto,
    };

    await discardDiaryPhotoDraft(
      { kind: "persisted", photo: previousPhoto },
      files,
    );
    await discardDiaryPhotoDraft(
      { kind: "prepared", photo: preparedPhoto },
      files,
    );

    expect(discardedIds).toEqual(["photo-b"]);
  });

  it("persists DB state before cleaning a replaced photo", async () => {
    const calls: string[] = [];
    const repository = createRepository({
      upsertRecord: async () => {
        calls.push("repository-upsert");
      },
    });
    const files = {
      deletePersisted: async (photo: typeof previousPhoto) => {
        calls.push(`delete:${photo.id}`);
      },
      discardPrepared: async () => {
        calls.push("discard-prepared");
      },
      persistPrepared: async () => {
        calls.push("persist-prepared");
        return nextPhoto;
      },
    };

    await expect(
      saveDiaryRecord(
        {
          entry,
          photoDraft: { kind: "prepared", photo: preparedPhoto },
          previousPhoto,
          repository,
        },
        files,
      ),
    ).resolves.toEqual(nextPhoto);
    expect(calls).toEqual([
      "persist-prepared",
      "repository-upsert",
      "discard-prepared",
      "delete:photo-a",
    ]);
  });

  it("compensates the new photo without deleting the old one on DB failure", async () => {
    const deletedIds: string[] = [];
    const repository = createRepository({
      upsertRecord: async () => {
        throw new Error("DB failed");
      },
    });
    const files = {
      deletePersisted: async (photo: typeof previousPhoto) => {
        deletedIds.push(photo.id);
      },
      discardPrepared: async () => undefined,
      persistPrepared: async () => nextPhoto,
    };

    await expect(
      saveDiaryRecord(
        {
          entry,
          photoDraft: { kind: "prepared", photo: preparedPhoto },
          previousPhoto,
          repository,
        },
        files,
      ),
    ).rejects.toThrow("DB failed");
    expect(deletedIds).toEqual(["photo-b"]);
  });

  it("deletes the DB record before its persisted photo file", async () => {
    const calls: string[] = [];
    const repository = createRepository({
      deleteById: async () => {
        calls.push("repository-delete");
        return { entry, photo: previousPhoto };
      },
    });

    await deleteDiaryRecord(repository, entry.id, {
      deletePersisted: async () => {
        calls.push("delete-file");
      },
      discardPrepared: async () => undefined,
      persistPrepared: async () => nextPhoto,
    });

    expect(calls).toEqual(["repository-delete", "delete-file"]);
  });

  it("keeps a successful DB deletion when file cleanup fails", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    const repository = createRepository({
      deleteById: async () => ({ entry, photo: previousPhoto }),
    });

    await expect(
      deleteDiaryRecord(repository, entry.id, {
        deletePersisted: async () => {
          throw new Error("File cleanup failed");
        },
        discardPrepared: async () => undefined,
        persistPrepared: async () => nextPhoto,
      }),
    ).resolves.toEqual({ entry, photo: previousPhoto });
    expect(consoleError).toHaveBeenCalledWith(
      "[DiaryPhoto] Failed to remove a deleted diary photo",
      expect.any(Error),
    );

    consoleError.mockRestore();
  });
});
