export type AvatarPartSlot =
  | "body"
  | "hair"
  | "top"
  | "bottom"
  | "accessory";

export interface AvatarConfig {
  bodyId: string;
  hairId: string;
  topId: string;
  bottomId: string;
  accessoryId: string | null;
}
