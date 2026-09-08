import { resolveAvatarConfig } from "@/features/avatar/avatarSelection";
import type { AvatarConfig } from "@/features/avatar/avatar.types";
import type { AvatarRepository } from "@/features/avatar/repository/AvatarRepository";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const WEB_AVATAR_STORAGE_KEY = "dayweave:avatar-config:v1";

function parseStoredConfig(raw: string): AvatarConfig {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Stored Avatar config must be an object");
  }

  const candidate = Object.fromEntries(
    ["bodyId", "hairId", "topId", "bottomId", "accessoryId"].map((key) => [
      key,
      Object.prototype.hasOwnProperty.call(parsed, key)
        ? Reflect.get(parsed, key)
        : undefined,
    ]),
  );
  return resolveAvatarConfig(candidate);
}

function getBrowserStorage(): StorageLike {
  if (typeof window === "undefined") {
    throw new Error("Web Avatar storage is only available in a browser");
  }
  return window.localStorage;
}

export class LocalStorageAvatarRepository implements AvatarRepository {
  constructor(private readonly storage: StorageLike = getBrowserStorage()) {}

  async getConfig(): Promise<AvatarConfig | null> {
    const raw = this.storage.getItem(WEB_AVATAR_STORAGE_KEY);
    if (!raw) return null;

    try {
      return parseStoredConfig(raw);
    } catch {
      throw new Error("Web Avatar storage contains invalid data");
    }
  }

  async saveConfig(config: AvatarConfig): Promise<void> {
    this.storage.setItem(WEB_AVATAR_STORAGE_KEY, JSON.stringify(config));
  }
}
