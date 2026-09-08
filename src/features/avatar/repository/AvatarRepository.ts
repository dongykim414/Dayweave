import type { AvatarConfig } from "@/features/avatar/avatar.types";

export interface AvatarRepository {
  getConfig(): Promise<AvatarConfig | null>;
  saveConfig(config: AvatarConfig): Promise<void>;
}
