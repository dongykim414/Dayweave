import { useEffect, useMemo, useRef, useState } from "react";

import { useAvatarRepository } from "@/database/AvatarRepositoryContext";
import {
  DEFAULT_AVATAR_CONFIG,
  DEFAULT_OWNED_AVATAR_ITEM_IDS,
} from "@/features/avatar/avatarCatalog";
import {
  getOwnedAvatarItems,
  getSelectedAvatarItemId,
  selectOwnedAvatarItem,
} from "@/features/avatar/avatarSelection";
import type {
  AvatarConfig,
  AvatarItemId,
  AvatarSelectableCategory,
} from "@/features/avatar/avatar.types";

export function useAvatar() {
  const repository = useAvatarRepository();
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const configRef = useRef<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const persistedConfigRef = useRef<AvatarConfig>(DEFAULT_AVATAR_CONFIG);
  const [selectedCategory, setSelectedCategory] =
    useState<AvatarSelectableCategory>("hair");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [retryRevision, setRetryRevision] = useState(0);
  const mountedRef = useRef(true);
  const selectionRevision = useRef(0);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  const updateConfig = (next: AvatarConfig) => {
    configRef.current = next;
    setConfig(next);
  };

  useEffect(() => {
    mountedRef.current = true;
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const persisted = await repository.getConfig();
        const nextConfig = persisted ?? DEFAULT_AVATAR_CONFIG;
        if (!active) return;

        updateConfig(nextConfig);
        await repository.saveConfig(nextConfig);
        persistedConfigRef.current = nextConfig;
      } catch (caughtError) {
        console.error("[Avatar] Failed to load Avatar config", caughtError);
        if (active) {
          updateConfig(DEFAULT_AVATAR_CONFIG);
          setError("아바타를 불러오지 못했어요. 기본 모습으로 보여드릴게요.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
      mountedRef.current = false;
    };
  }, [repository, retryRevision]);

  const items = useMemo(
    () => getOwnedAvatarItems(selectedCategory),
    [selectedCategory],
  );
  const selectedItemId = getSelectedAvatarItemId(config, selectedCategory);

  const selectPart = (
    category: AvatarSelectableCategory,
    itemId: AvatarItemId | null,
  ) => {
    let nextConfig: AvatarConfig;
    try {
      nextConfig = selectOwnedAvatarItem(
        configRef.current,
        category,
        itemId,
        DEFAULT_OWNED_AVATAR_ITEM_IDS,
      );
    } catch (caughtError) {
      console.error("[Avatar] Rejected an invalid selection", caughtError);
      setError("선택할 수 없는 아바타 아이템이에요.");
      return;
    }

    if (JSON.stringify(nextConfig) === JSON.stringify(configRef.current)) return;

    const revision = ++selectionRevision.current;
    updateConfig(nextConfig);
    setSaving(true);
    setError(null);
    setFeedback(null);

    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => repository.saveConfig(nextConfig));

    void saveQueue.current
      .then(() => {
        persistedConfigRef.current = nextConfig;
        if (mountedRef.current && revision === selectionRevision.current) {
          setFeedback("아바타가 저장됐어요.");
        }
      })
      .catch((caughtError: unknown) => {
        console.error("[Avatar] Failed to save Avatar config", caughtError);
        if (mountedRef.current && revision === selectionRevision.current) {
          updateConfig(persistedConfigRef.current);
          setError("아바타를 저장하지 못해 이전 모습으로 돌아갔어요.");
        }
      })
      .finally(() => {
        if (mountedRef.current && revision === selectionRevision.current) {
          setSaving(false);
        }
      });
  };

  return {
    config,
    error,
    feedback,
    items,
    loading,
    retry: () => setRetryRevision((current) => current + 1),
    saving,
    selectPart,
    selectedCategory,
    selectedItemId,
    setSelectedCategory,
  };
}
