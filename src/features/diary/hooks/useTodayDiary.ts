import { useEffect, useRef, useState } from "react";
import * as Crypto from "expo-crypto";

import { useDiaryRepository } from "@/database/DiaryRepositoryContext";
import { buildDiaryEntry } from "@/features/diary/model/buildDiaryEntry";
import { toLocalDateKey } from "@/features/diary/model/diaryDate";
import type {
  DiaryDraft,
  DiaryEntry,
} from "@/features/diary/model/diary.types";
import {
  normalizeDiaryDraft,
  validateDiaryDraft,
} from "@/features/diary/model/diaryValidation";
import type { MoodId } from "@/features/mood/mood.types";

const EMPTY_DRAFT: DiaryDraft = {
  moodId: null,
  shortText: "",
  content: "",
};

function getUserErrorMessage(action: "load" | "save"): string {
  return action === "load"
    ? "오늘의 기록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
    : "오늘의 기록을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";
}

export function useTodayDiary() {
  const repository = useDiaryRepository();
  const [entryDate] = useState(() => toLocalDateKey(new Date()));
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [draft, setDraft] = useState<DiaryDraft>(EMPTY_DRAFT);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;

    const loadTodayDiary = async () => {
      try {
        const existingEntry = await repository.getByDate(entryDate);

        if (!active) {
          return;
        }

        setEntry(existingEntry);
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
    };
  }, [entryDate, repository]);

  const updateMood = (moodId: MoodId) => {
    setDraft((current) => ({ ...current, moodId }));
    setError(null);
    setFeedback(null);
  };

  const updateShortText = (shortText: string) => {
    setDraft((current) => ({ ...current, shortText }));
    setError(null);
    setFeedback(null);
  };

  const updateContent = (content: string) => {
    setDraft((current) => ({ ...current, content }));
    setError(null);
    setFeedback(null);
  };

  const toggleExpanded = () => {
    setIsExpanded((current) => !current);
  };

  const save = async (): Promise<void> => {
    if (savingRef.current) {
      return;
    }

    const validationError = validateDiaryDraft(draft);

    if (validationError) {
      setError(validationError);
      setFeedback(null);
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError(null);
    setFeedback(null);

    try {
      const nextEntry = buildDiaryEntry({
        createId: Crypto.randomUUID,
        draft,
        entryDate,
        existingEntry: entry,
        now: new Date(),
      });

      await repository.upsert(nextEntry);
      setEntry(nextEntry);
      setDraft(normalizeDiaryDraft(draft));
      setFeedback("오늘의 기록을 남겼어요.");
    } catch (caughtError) {
      console.error("[Diary] Failed to save today's entry", caughtError);
      setError(getUserErrorMessage("save"));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return {
    draft,
    entry,
    error,
    feedback,
    isExpanded,
    loading,
    save,
    saving,
    toggleExpanded,
    updateContent,
    updateMood,
    updateShortText,
  };
}
