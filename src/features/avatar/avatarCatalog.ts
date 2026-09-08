import type {
  AvatarAccessoryId,
  AvatarBodyId,
  AvatarBottomId,
  AvatarHairId,
  AvatarItemDefinition,
  AvatarItemId,
  AvatarItemType,
  AvatarTopId,
} from "@/features/avatar/avatar.types";

export const AVATAR_CATALOG = {
  body: [
    { id: "body_default", type: "body", displayName: "기본 바디", isDefault: true },
  ] satisfies readonly AvatarItemDefinition<AvatarBodyId>[],
  hair: [
    { id: "hair_soft_bob", type: "hair", displayName: "소프트 단발", isDefault: true },
    { id: "hair_long_wave", type: "hair", displayName: "긴 웨이브", isDefault: false },
    { id: "hair_short_crop", type: "hair", displayName: "짧은 머리", isDefault: false },
  ] satisfies readonly AvatarItemDefinition<AvatarHairId>[],
  top: [
    { id: "top_cloud_tee", type: "top", displayName: "구름 티셔츠", isDefault: true },
    { id: "top_mint_sweater", type: "top", displayName: "민트 스웨터", isDefault: false },
    { id: "top_lilac_cardigan", type: "top", displayName: "라일락 가디건", isDefault: false },
  ] satisfies readonly AvatarItemDefinition<AvatarTopId>[],
  bottom: [
    { id: "bottom_denim", type: "bottom", displayName: "데님 팬츠", isDefault: true },
    { id: "bottom_sand_skirt", type: "bottom", displayName: "샌드 스커트", isDefault: false },
  ] satisfies readonly AvatarItemDefinition<AvatarBottomId>[],
  accessory: [
    { id: "accessory_round_glasses", type: "accessory", displayName: "동그란 안경", isDefault: false },
    { id: "accessory_star_pin", type: "accessory", displayName: "별 머리핀", isDefault: false },
  ] satisfies readonly AvatarItemDefinition<AvatarAccessoryId>[],
} as const;

export const DEFAULT_AVATAR_CONFIG = {
  bodyId: "body_default",
  hairId: "hair_soft_bob",
  topId: "top_cloud_tee",
  bottomId: "bottom_denim",
  accessoryId: null,
} as const;

export const DEFAULT_OWNED_AVATAR_ITEM_IDS: ReadonlySet<AvatarItemId> = new Set([
  ...AVATAR_CATALOG.body,
  ...AVATAR_CATALOG.hair,
  ...AVATAR_CATALOG.top,
  ...AVATAR_CATALOG.bottom,
  ...AVATAR_CATALOG.accessory,
].map((item) => item.id));

export function getCatalogItems(type: AvatarItemType): readonly AvatarItemDefinition[] {
  return AVATAR_CATALOG[type];
}
