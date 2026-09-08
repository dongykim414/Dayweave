import type {
  DiaryPhoto,
  DiaryPhotoDraft,
  DiaryRecord,
  PreparedDiaryPhoto,
} from "@/features/diary/model/diaryPhoto.types";
import type {
  DiaryEntry,
  DiaryEntryId,
} from "@/features/diary/model/diary.types";
import { shouldDeletePreviousPhoto } from "@/features/diary/model/photoLifecycle";
import type { DiaryRepository } from "@/features/diary/repository/DiaryRepository";
import {
  deletePersistedDiaryPhoto,
  discardPreparedDiaryPhoto,
  persistPreparedDiaryPhoto,
} from "@/features/diary/services/diaryPhotoService";

interface DiaryPhotoFileOperations {
  deletePersisted(photo: DiaryPhoto): Promise<void>;
  discardPrepared(photo: PreparedDiaryPhoto): Promise<void>;
  persistPrepared(
    photo: PreparedDiaryPhoto,
    entryId: DiaryEntryId,
  ): Promise<DiaryPhoto>;
}

interface SaveDiaryRecordInput {
  entry: DiaryEntry;
  photoDraft: DiaryPhotoDraft | null;
  previousPhoto: DiaryPhoto | null;
  repository: DiaryRepository;
}

const defaultFileOperations: DiaryPhotoFileOperations = {
  deletePersisted: deletePersistedDiaryPhoto,
  discardPrepared: discardPreparedDiaryPhoto,
  persistPrepared: persistPreparedDiaryPhoto,
};

async function safelyRunFileCleanup(
  cleanup: () => Promise<void>,
  message: string,
): Promise<void> {
  try {
    await cleanup();
  } catch (caughtError) {
    console.error(message, caughtError);
  }
}

export async function discardDiaryPhotoDraft(
  photoDraft: DiaryPhotoDraft | null,
  fileOperations: DiaryPhotoFileOperations = defaultFileOperations,
): Promise<void> {
  if (photoDraft?.kind !== "prepared") {
    return;
  }

  await safelyRunFileCleanup(
    () => fileOperations.discardPrepared(photoDraft.photo),
    "[DiaryPhoto] Failed to remove a staged photo",
  );
}

export async function saveDiaryRecord(
  { entry, photoDraft, previousPhoto, repository }: SaveDiaryRecordInput,
  fileOperations: DiaryPhotoFileOperations = defaultFileOperations,
): Promise<DiaryPhoto | null> {
  let newPersistedPhoto: DiaryPhoto | null = null;

  try {
    const nextPhoto =
      photoDraft?.kind === "prepared"
        ? await fileOperations.persistPrepared(photoDraft.photo, entry.id)
        : (photoDraft?.photo ?? null);

    if (photoDraft?.kind === "prepared") {
      newPersistedPhoto = nextPhoto;
    }

    await repository.upsertRecord(entry, nextPhoto);

    await discardDiaryPhotoDraft(photoDraft, fileOperations);
    if (previousPhoto && shouldDeletePreviousPhoto(previousPhoto, nextPhoto)) {
      await safelyRunFileCleanup(
        () => fileOperations.deletePersisted(previousPhoto),
        "[DiaryPhoto] Failed to remove a replaced photo",
      );
    }

    return nextPhoto;
  } catch (caughtError) {
    if (newPersistedPhoto) {
      const photoToDelete = newPersistedPhoto;
      await safelyRunFileCleanup(
        () => fileOperations.deletePersisted(photoToDelete),
        "[DiaryPhoto] Failed to compensate a persisted photo",
      );
    }
    await discardDiaryPhotoDraft(photoDraft, fileOperations);
    throw caughtError;
  }
}

export async function deleteDiaryRecord(
  repository: DiaryRepository,
  id: DiaryEntryId,
  fileOperations: DiaryPhotoFileOperations = defaultFileOperations,
): Promise<DiaryRecord | null> {
  const deletedRecord = await repository.deleteById(id);

  if (deletedRecord?.photo) {
    const photoToDelete = deletedRecord.photo;
    await safelyRunFileCleanup(
      () => fileOperations.deletePersisted(photoToDelete),
      "[DiaryPhoto] Failed to remove a deleted diary photo",
    );
  }

  return deletedRecord;
}
