import { resolvePersonalizationSettings } from "@/features/personalization/personalizationSelection";
import type { PersonalizationRepository } from "@/features/personalization/repository/PersonalizationRepository";
import type { PersonalizationSettings } from "@/features/personalization/personalization.types";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = "dayweave:personalization-settings:v1";

function getBrowserStorage(): StorageLike {
  if (typeof window === "undefined") {
    throw new Error("Web personalization storage is only available in a browser");
  }
  return window.localStorage;
}

function parseSettings(raw: string): PersonalizationSettings {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Stored personalization settings must be an object");
  }
  return resolvePersonalizationSettings({
    selectedThemeId: Reflect.get(parsed, "selectedThemeId"),
    selectedMoodPackId: Reflect.get(parsed, "selectedMoodPackId"),
  });
}

export class LocalStoragePersonalizationRepository implements PersonalizationRepository {
  constructor(private readonly storage: StorageLike = getBrowserStorage()) {}

  async getSettings(): Promise<PersonalizationSettings | null> {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return parseSettings(raw);
    } catch {
      throw new Error("Web personalization storage contains invalid data");
    }
  }

  async saveSettings(settings: PersonalizationSettings): Promise<void> {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
