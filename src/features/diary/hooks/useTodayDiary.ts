import { useEffect, useRef, useState } from "react";
import * as Crypto from "expo-crypto";

import { useDiaryRepository } from "@/database/DiaryRepositoryContext";
import { buildDiaryEntry } from "@/features/diary/model/buildDiaryEntry";
import { toLocalDateKey } from "@/features/diary/model/diaryDate";
import type {
  DiaryPhoto,
  DiaryPhotoDraft,
  PreparedDiaryPhoto,
} from "@/features/diary/model/diaryPhoto.types";
import type {
  DiaryDraft,
  DiaryEntry,
} from "@/features/diary/model/diary.types";
import { shouldDeletePreviousPhoto } from "@/features/diary/model/photoLifecycle";
import {
  normalizeDiaryDraft,
  validateDiaryDraft,
} from "@/features/diary/model/diaryValidation";
import {
  deletePersistedDiaryPhoto,
  discardPreparedDiaryPhoto,
  isDiaryPhotoFileAvailable,
  persistPreparedDiaryPhoto,
  selectDiaryPhoto,
} from "@/features/diary/services/diaryPhotoService";
import type { MoodId } from "@/features/mood/mood.types";

const EMPTY_DRAFT: DiaryDraft = {
  moodId: null,
  shortText: "",
  content: "",
};

function getUserErrorMessage(action: "load" | "photo" | "save"): string {
  if (action === "load") {
    return "오늘의 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  if (action === "photo") {
    return "사진을 준비하지 못했어요. 다른 사진으로 다시 시도해 주세요.";
  }

  return "오늘의 기록을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";
}

async function safelyDiscardPreparedPhoto(
  photo: PreparedDiaryPhoto,
): Promise<void> {
  try {
    await discardPreparedDiaryPhoto(photo);
  } catch (caughtError) {
    console.error("[DiaryPhoto] Failed to remove a staged photo", caughtError);
  }
}

async function safelyDeletePersistedPhoto(photo: DiaryPhoto): Promise<void> {
  try {
    await deletePersistedDiaryPhoto(photo);
  } catch (caughtError) {
    console.error("[DiaryPhoto] Failed to remove a persisted photo", caughtError);
  }
}

export function useTodayDiary() {
  const repository = useDiaryRepository();
  const [entryDate] = useState(() => toLocalDateKey(new Date()));
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [persistedPhoto, setPersistedPhoto] = useState<DiaryPhoto | null>(null);
  const [photoDraft, setPhotoDraft] = useState<DiaryPhotoDraft | null>(null);
  const photoDraftRef = useRef<DiaryPhotoDraft | null>(null);
  const [photoAvailable, setPhotoAvailable] = useState(true);
  const [selectingPhoto, setSelectingPhoto] = useState(false);
  const [draft, setDraft] = useState<DiaryDraft>(EMPTY_DRAFT);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const savingRef = useRef(false);

  const updatePhotoDraft = (nextPhoto: DiaryPhotoDraft | null) => {
    photoDraftRef.current = nextPhoto;
    setPhotoDraft(nextPhoto);
  };

  useEffect(() => {
    mountedRef.current = true;
    let active = true;

    const loadTodayDiary = async () => {
      try {
        const record = await repository.getRecordByDate(entryDate);

        if (!active) {
          return;
        }

        const existingEntry = record?.entry ?? null;
        const existingPhoto = record?.photo ?? null;
        setEntry(existingEntry);
        setPersistedPhoto(existingPhoto);
        updatePhotoDraft(
          existingPhoto ? { kind: "persisted", photo: existingPhoto } : null,
        );
        setDraft(
          existingEntry
            ? {
                moodId: existingEntry.moodId,
                shortText: existingEntry.shortText,
                content: existingEntry.content,
              }
            : EMPTY_DRAFT,
        );
        setIsExpanded(Boolean(existingEntry?.content));

        if (existingPhoto) {
          const available = await isDiaryPhotoFileAvailable(existingPhoto);
          if (active) {
            setPhotoAvailable(available);
          }
        }
      } catch (caughtError) {
        console.error("[Diary] Failed to load today's entry", caughtError);
        if (active) {
          setError(getUserErrorMessage("load"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadTodayDiary();

    return () => {
      active = false;
      mountedRef.current = false;
      const currentPhoto = photoDraftRef.current;
      if (currentPhoto?.kind === "prepared" && !savingRef.current) {
        void safelyDiscardPreparedPhoto(currentPhoto.photo);
      }
    };
  }, [entryDate, repository]);

  const clearMessages = () => {
    setError(null);
    setFeedback(null);
  };

  const updateMood = (moodId: MoodId) => {
    setDraft((current) => ({ ...current, moodId }));
    clearMessages();
  };

  const updateShortText = (shortText: string) => {
    setDraft((current) => ({ ...current, shortText }));
    clearMessages();
  };

  const updateContent = (content: string) => {
    setDraft((current) => ({ ...current, content }));
    clearMessages();
  };

  const toggleExpanded = () => {
    setIsExpanded((current) => !current);
  };

  const selectPhoto = async (): Promise<void> => {
    if (selectingPhoto || savingRef.current) {
      return;
    }

    setSelectingPhoto(true);
    clearMessages();

    try {
      const result = await selectDiaryPhoto();

      if (!mountedRef.current) {
        if (result.status === "selected") {
          await safelyDiscardPreparedPhoto(result.photo);
        }
        return;
      }

      if (result.status === "cancelled") {
        return;
      }

      if (result.status === "permission-denied") {
        setError("사진을 추가하려면 사진 접근 권한이 필요해요.");
        return;
      }

      if (result.status === "unsupported") {
        setError("사진 추가는 현재 Android와 iOS 앱에서 지원해요.");
        return;
      }

      const currentPhoto = photoDraftRef.current;
      if (currentPhoto?.kind === "prepared") {
        await safelyDiscardPreparedPhoto(currentPhoto.photo);
      }

      updatePhotoDraft({ kind: "prepared", photo: result.photo });
      setPhotoAvailable(true);
    } catch (caughtError) {
      console.error("[DiaryPhoto] Failed to prepare a selected photo", caughtError);
      if (mountedRef.current) {
        setError(getUserErrorMessage("photo"));
      }
    } finally {
      if (mountedRef.current) {
        setSelectingPhoto(false);
      }
    }
  };

  const removePhoto = (): void => {
    const currentPhoto = photoDraftRef.current;
    if (currentPhoto?.kind === "prepared") {
      void safelyDiscardPreparedPhoto(currentPhoto.photo);
    }
    updatePhotoDraft(null);
    setPhotoAvailable(true);
    clearMessages();
  };

  const save = async (): Promise<void> => {
    if (savingRef.current) {
      return;
    }

    const currentPhotoDraft = photoDraftRef.current;
    const validationError = validateDiaryDraft(draft, Boolean(currentPhotoDraft));

    if (validationError) {
      setError(validationError);
      setFeedback(null);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    clearMessages();

    let newPersistedPhoto: DiaryPhoto | null = null;

    try {
      const nextEntry = buildDiaryEntry({
        createId: Crypto.randomUUID,
        draft,
        entryDate,
        existingEntry: entry,
        hasPhoto: Boolean(currentPhotoDraft),
        now: new Date(),
      });

      const nextPhoto =
        currentPhotoDraft?.kind === "prepared"
          ? await persistPreparedDiaryPhoto(currentPhotoDraft.photo, nextEntry.id)
          : (currentPhotoDraft?.photo ?? null);

      if (currentPhotoDraft?.kind === "prepared") {
        newPersistedPhoto = nextPhoto;
      }

      await repository.upsertRecord(nextEntry, nextPhoto);

      if (currentPhotoDraft?.kind === "prepared") {
        await safelyDiscardPreparedPhoto(currentPhotoDraft.photo);
      }
      if (
        persistedPhoto &&
        shouldDeletePreviousPhoto(persistedPhoto, nextPhoto)
      ) {
        await safelyDeletePersistedPhoto(persistedPhoto);
      }

      setEntry(nextEntry);
      setPersistedPhoto(nextPhoto);
      updatePhotoDraft(
        nextPhoto ? { kind: "persisted", photo: nextPhoto } : null,
      );
      setPhotoAvailable(true);
      setDraft(normalizeDiaryDraft(draft));
      setFeedback("오늘의 기록을 남겼어요.");
    } catch (caughtError) {
      console.error("[Diary] Failed to save today's entry", caughtError);
      if (newPersistedPhoto) {
        await safelyDeletePersistedPhoto(newPersistedPhoto);
      }
      if (currentPhotoDraft?.kind === "prepared") {
        await safelyDiscardPreparedPhoto(currentPhotoDraft.photo);
        updatePhotoDraft(
          persistedPhoto ? { kind: "persisted", photo: persistedPhoto } : null,
        );
      }
      setError(getUserErrorMessage("save"));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const photoUri = photoDraft
    ? photoDraft.kind === "prepared"
      ? photoDraft.photo.previewUri
      : photoDraft.photo.localUri
    : null;

  return {
    draft,
    entry,
    error,
    feedback,
    isExpanded,
    loading,
    photoAvailable,
    photoUri,
    removePhoto,
    save,
    saving,
    selectPhoto,
    selectingPhoto,
    toggleExpanded,
    updateContent,
    updateMood,
    updateShortText,
  };
}
