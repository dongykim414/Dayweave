import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

import { useDiaryRepository } from "@/database/DiaryRepositoryContext";
import { buildDiaryEntry } from "@/features/diary/model/buildDiaryEntry";
import { isDiaryEditDirty } from "@/features/diary/model/diaryEdit";
import type {
  DiaryPhotoDraft,
  DiaryRecord,
} from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDraft } from "@/features/diary/model/diary.types";
import {
  hasDiaryContent,
  normalizeDiaryDraft,
  validateDiaryDraft,
} from "@/features/diary/model/diaryValidation";
import {
  isDiaryPhotoFileAvailable,
  selectDiaryPhoto,
} from "@/features/diary/services/diaryPhotoService";
import {
  deleteDiaryRecord,
  discardDiaryPhotoDraft,
  saveDiaryRecord,
} from "@/features/diary/services/diaryRecordLifecycle";
import type { MoodId } from "@/features/mood/mood.types";

const EMPTY_DRAFT: DiaryDraft = { moodId: null, shortText: "", content: "" };

function toDraft(record: DiaryRecord): DiaryDraft {
  return {
    moodId: record.entry.moodId,
    shortText: record.entry.shortText,
    content: record.entry.content,
  };
}

export function useDiaryDetail(id: string | null) {
  const repository = useDiaryRepository();
  const navigation = useNavigation();
  const router = useRouter();
  const [record, setRecord] = useState<DiaryRecord | null>(null);
  const [draft, setDraft] = useState<DiaryDraft>(EMPTY_DRAFT);
  const [photoDraft, setPhotoDraft] = useState<DiaryPhotoDraft | null>(null);
  const photoDraftRef = useRef<DiaryPhotoDraft | null>(null);
  const [photoAvailable, setPhotoAvailable] = useState(true);
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectingPhoto, setSelectingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [retryRevision, setRetryRevision] = useState(0);
  const mountedRef = useRef(true);
  const savingRef = useRef(false);
  const deletingRef = useRef(false);
  const allowNavigationRef = useRef(false);
  const loadRequest = useMemo(
    () => ({ id, retryRevision }),
    [id, retryRevision],
  );

  const updatePhotoDraft = useCallback((next: DiaryPhotoDraft | null) => {
    photoDraftRef.current = next;
    setPhotoDraft(next);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      const currentPhoto = photoDraftRef.current;
      if (currentPhoto?.kind === "prepared" && !savingRef.current) {
        void discardDiaryPhotoDraft(currentPhoto);
      }
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const loadRecord = async () => {
        if (!loadRequest.id) {
          setRecord(null);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        try {
          const nextRecord = await repository.getRecordById(loadRequest.id);
          if (!active) return;

          setRecord(nextRecord);
          if (nextRecord) {
            setDraft(toDraft(nextRecord));
            updatePhotoDraft(
              nextRecord.photo
                ? { kind: "persisted", photo: nextRecord.photo }
                : null,
            );
            const available = nextRecord.photo
              ? await isDiaryPhotoFileAvailable(nextRecord.photo)
              : true;
            if (active) setPhotoAvailable(available);
          }
        } catch (caughtError) {
          console.error("[DiaryDetail] Failed to load a diary", caughtError);
          if (active) {
            setError("기록을 불러오지 못했어요. 다시 시도해 주세요.");
          }
        } finally {
          if (active) setLoading(false);
        }
      };

      void loadRecord();
      return () => {
        active = false;
      };
    }, [loadRequest, repository, updatePhotoDraft]),
  );

  const dirty = useMemo(
    () => Boolean(record && isDiaryEditDirty(record, draft, photoDraft)),
    [draft, photoDraft, record],
  );

  const resetEditor = useCallback(async () => {
    await discardDiaryPhotoDraft(photoDraftRef.current);
    if (record) {
      setDraft(toDraft(record));
      updatePhotoDraft(
        record.photo ? { kind: "persisted", photo: record.photo } : null,
      );
      setPhotoAvailable(true);
    }
    setError(null);
    setEditing(false);
  }, [record, updatePhotoDraft]);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (event) => {
        if (!editing || !dirty || allowNavigationRef.current) return;

        event.preventDefault();
        Alert.alert(
          "수정 내용을 저장하지 않고 나갈까요?",
          "저장하지 않은 변경 사항은 사라져요.",
          [
            { text: "계속 수정", style: "cancel" },
            {
              text: "나가기",
              style: "destructive",
              onPress: () => {
                allowNavigationRef.current = true;
                void discardDiaryPhotoDraft(photoDraftRef.current).finally(() =>
                  navigation.dispatch(event.data.action),
                );
              },
            },
          ],
        );
      }),
    [dirty, editing, navigation],
  );

  const beginEdit = () => {
    if (!record) return;
    setDraft(toDraft(record));
    updatePhotoDraft(
      record.photo ? { kind: "persisted", photo: record.photo } : null,
    );
    setExpanded(true);
    setError(null);
    setFeedback(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (!dirty) {
      void resetEditor();
      return;
    }

    Alert.alert("수정을 취소할까요?", "저장하지 않은 변경 사항은 사라져요.", [
      { text: "계속 수정", style: "cancel" },
      {
        text: "수정 취소",
        style: "destructive",
        onPress: () => void resetEditor(),
      },
    ]);
  };

  const selectPhoto = async () => {
    if (selectingPhoto || savingRef.current || deletingRef.current) return;

    setSelectingPhoto(true);
    setError(null);
    try {
      const result = await selectDiaryPhoto();
      if (!mountedRef.current) {
        if (result.status === "selected") {
          await discardDiaryPhotoDraft({ kind: "prepared", photo: result.photo });
        }
        return;
      }
      if (result.status === "cancelled") return;
      if (result.status === "permission-denied") {
        setError("사진을 추가하려면 사진 접근 권한이 필요해요.");
        return;
      }
      if (result.status === "unsupported") {
        setError("사진 수정은 현재 Android와 iOS 앱에서 지원해요.");
        return;
      }

      await discardDiaryPhotoDraft(photoDraftRef.current);
      updatePhotoDraft({ kind: "prepared", photo: result.photo });
      setPhotoAvailable(true);
    } catch (caughtError) {
      console.error("[DiaryDetail] Failed to prepare a photo", caughtError);
      if (mountedRef.current) {
        setError("사진을 준비하지 못했어요. 다른 사진으로 다시 시도해 주세요.");
      }
    } finally {
      if (mountedRef.current) setSelectingPhoto(false);
    }
  };

  const removePhoto = () => {
    void discardDiaryPhotoDraft(photoDraftRef.current);
    updatePhotoDraft(null);
    setPhotoAvailable(true);
    setError(null);
  };

  const save = async () => {
    if (!record || savingRef.current || deletingRef.current) return;

    const currentPhotoDraft = photoDraftRef.current;
    if (!hasDiaryContent(draft, Boolean(currentPhotoDraft))) {
      setError("기록을 모두 지우려면 삭제를 사용해 주세요.");
      return;
    }
    const validationError = validateDiaryDraft(draft, Boolean(currentPhotoDraft));
    if (validationError) {
      setError(validationError);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const nextEntry = buildDiaryEntry({
        createId: () => record.entry.id,
        draft,
        entryDate: record.entry.entryDate,
        existingEntry: record.entry,
        hasPhoto: Boolean(currentPhotoDraft),
        now: new Date(),
      });
      const nextPhoto = await saveDiaryRecord({
        entry: nextEntry,
        photoDraft: currentPhotoDraft,
        previousPhoto: record.photo,
        repository,
      });
      const nextRecord = { entry: nextEntry, photo: nextPhoto };

      setRecord(nextRecord);
      setDraft(normalizeDiaryDraft(draft));
      updatePhotoDraft(
        nextPhoto ? { kind: "persisted", photo: nextPhoto } : null,
      );
      setPhotoAvailable(true);
      setEditing(false);
      setFeedback("기록을 수정했어요.");
    } catch (caughtError) {
      console.error("[DiaryDetail] Failed to update a diary", caughtError);
      if (currentPhotoDraft?.kind === "prepared") {
        updatePhotoDraft(
          record.photo ? { kind: "persisted", photo: record.photo } : null,
        );
      }
      setError("기록을 수정하지 못했어요. 다시 시도해 주세요.");
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!record || savingRef.current || deletingRef.current) return;

    Alert.alert("이 기록을 삭제할까요?", "삭제한 기록은 되돌릴 수 없어요.", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (deletingRef.current) return;
          deletingRef.current = true;
          setDeleting(true);
          setError(null);

          void deleteDiaryRecord(repository, record.entry.id)
            .then(() => {
              allowNavigationRef.current = true;
              router.replace("/timeline");
            })
            .catch((caughtError: unknown) => {
              console.error("[DiaryDetail] Failed to delete a diary", caughtError);
              if (mountedRef.current) {
                setError("기록을 삭제하지 못했어요. 다시 시도해 주세요.");
              }
            })
            .finally(() => {
              deletingRef.current = false;
              if (mountedRef.current) setDeleting(false);
            });
        },
      },
    ]);
  };

  const photoUri = photoDraft
    ? photoDraft.kind === "prepared"
      ? photoDraft.photo.previewUri
      : photoDraft.photo.localUri
    : null;

  return {
    beginEdit,
    cancelEdit,
    confirmDelete,
    deleting,
    draft,
    editing,
    error,
    expanded,
    feedback,
    loading,
    photoAvailable,
    photoUri,
    record,
    removePhoto,
    retry: () => setRetryRevision((current) => current + 1),
    save,
    saving,
    selectPhoto,
    selectingPhoto,
    setContent: (content: string) =>
      setDraft((current) => ({ ...current, content })),
    setMood: (moodId: MoodId | null) =>
      setDraft((current) => ({ ...current, moodId })),
    setShortText: (shortText: string) =>
      setDraft((current) => ({ ...current, shortText })),
    toggleExpanded: () => setExpanded((current) => !current),
  };
}
