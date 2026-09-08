import { resolveAvatarConfig } from "@/features/avatar/avatarSelection";
import type { AvatarConfig } from "@/features/avatar/avatar.types";

export interface AvatarConfigRow {
  body_id: string;
  hair_id: string;
  top_id: string;
  bottom_id: string;
  accessory_id: string | null;
  updated_at: string;
}

export function toAvatarConfig(row: AvatarConfigRow): AvatarConfig {
  return resolveAvatarConfig({
    bodyId: row.body_id,
    hairId: row.hair_id,
    topId: row.top_id,
    bottomId: row.bottom_id,
    accessoryId: row.accessory_id,
  });
}
