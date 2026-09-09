import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { usePersonalizationRepository } from "@/database/PersonalizationRepositoryContext";
import type { MoodPackId } from "@/features/mood/mood.types";
import {
  DEFAULT_PERSONALIZATION_SETTINGS,
  selectMoodPack,
  selectTheme,
} from "@/features/personalization/personalizationSelection";
import type { PersonalizationSettings } from "@/features/personalization/personalization.types";
import { skyTheme } from "@/features/theme/themes/sky";
import type { ThemeId } from "@/features/theme";

interface PersonalizationContextValue {
  error: string | null;
  retry: () => void;
  saving: boolean;
  selectMoodPack: (moodPackId: MoodPackId) => void;
  selectTheme: (themeId: ThemeId) => void;
  settings: PersonalizationSettings;
}

const Context = createContext<PersonalizationContextValue | null>(null);

export function PersonalizationProvider({ children }: PropsWithChildren) {
  const repository = usePersonalizationRepository();
  const [settings, setSettings] = useState(DEFAULT_PERSONALIZATION_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryRevision, setRetryRevision] = useState(0);
  const settingsRef = useRef(settings);
  const persistedRef = useRef(settings);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const revisionRef = useRef(0);
  const mountedRef = useRef(true);

  const apply = (next: PersonalizationSettings) => {
    settingsRef.current = next;
    setSettings(next);
  };

  useEffect(() => {
    mountedRef.current = true;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const loaded = (await repository.getSettings()) ?? DEFAULT_PERSONALIZATION_SETTINGS;
        if (!active) return;
        apply(loaded);
        await repository.saveSettings(loaded);
        persistedRef.current = loaded;
      } catch (caughtError) {
        console.error("[Personalization] Failed to load settings", caughtError);
        if (active) {
          apply(DEFAULT_PERSONALIZATION_SETTINGS);
          setError("개인화 설정을 불러오지 못해 기본 설정을 적용했어요.");
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

  const persist = (next: PersonalizationSettings) => {
    if (
      next.selectedThemeId === settingsRef.current.selectedThemeId &&
      next.selectedMoodPackId === settingsRef.current.selectedMoodPackId
    ) {
      return;
    }
    const revision = ++revisionRef.current;
    apply(next);
    setSaving(true);
    setError(null);
    saveQueue.current = saveQueue.current
      .catch(() => undefined)
      .then(() => repository.saveSettings(next));
    void saveQueue.current
      .then(() => {
        persistedRef.current = next;
      })
      .catch((caughtError: unknown) => {
        console.error("[Personalization] Failed to save settings", caughtError);
        if (mountedRef.current && revision === revisionRef.current) {
          apply(persistedRef.current);
          setError("설정을 저장하지 못해 이전 선택으로 돌아갔어요.");
        }
      })
      .finally(() => {
        if (mountedRef.current && revision === revisionRef.current) setSaving(false);
      });
  };

  if (loading) {
    return (
      <View style={{ alignItems: "center", backgroundColor: skyTheme.colors.background, flex: 1, gap: skyTheme.spacing.sm, justifyContent: "center" }}>
        <ActivityIndicator color={skyTheme.colors.primary} />
        <Text style={{ color: skyTheme.colors.textSecondary }}>개인화 설정을 준비하고 있어요.</Text>
      </View>
    );
  }

  return (
    <Context.Provider
      value={{
        error,
        retry: () => setRetryRevision((current) => current + 1),
        saving,
        selectMoodPack: (id) => persist(selectMoodPack(settingsRef.current, id)),
        selectTheme: (id) => persist(selectTheme(settingsRef.current, id)),
        settings,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function usePersonalization(): PersonalizationContextValue {
  const context = useContext(Context);
  if (!context) throw new Error("usePersonalization must be used within PersonalizationProvider");
  return context;
}
