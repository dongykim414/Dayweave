export type AvatarItemType =
  | "body"
  | "hair"
  | "top"
  | "bottom"
  | "accessory";

export type AvatarSelectableCategory = Exclude<AvatarItemType, "body">;
export type AvatarBodyId = "body_default";
export type AvatarHairId =
  | "hair_soft_bob"
  | "hair_long_wave"
  | "hair_short_crop";
export type AvatarTopId =
  | "top_cloud_tee"
  | "top_mint_sweater"
  | "top_lilac_cardigan";
export type AvatarBottomId = "bottom_denim" | "bottom_sand_skirt";
export type AvatarAccessoryId =
  | "accessory_round_glasses"
  | "accessory_star_pin";

export type AvatarItemId =
  | AvatarBodyId
  | AvatarHairId
  | AvatarTopId
  | AvatarBottomId
  | AvatarAccessoryId;

export interface AvatarConfig {
  bodyId: AvatarBodyId;
  hairId: AvatarHairId;
  topId: AvatarTopId;
  bottomId: AvatarBottomId;
  accessoryId: AvatarAccessoryId | null;
}

export interface AvatarConfigCandidate {
  bodyId?: string | null;
  hairId?: string | null;
  topId?: string | null;
  bottomId?: string | null;
  accessoryId?: string | null;
}

export interface AvatarItemDefinition<TId extends AvatarItemId = AvatarItemId> {
  id: TId;
  type: AvatarItemType;
  displayName: string;
  isDefault: boolean;
}

export type AvatarLayerSlot =
  | "hairBack"
  | "body"
  | "bottom"
  | "top"
  | "hairFront"
  | "accessory";

export interface AvatarLayerPrimitive {
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  height: number;
  left: number;
  rotate?: string;
  top: number;
  width: number;
}

export type AvatarVisualDefinition = Partial<
  Record<AvatarLayerSlot, readonly AvatarLayerPrimitive[]>
>;
