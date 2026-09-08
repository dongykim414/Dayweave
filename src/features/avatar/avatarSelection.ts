import {
  AVATAR_CATALOG,
  DEFAULT_AVATAR_CONFIG,
  DEFAULT_OWNED_AVATAR_ITEM_IDS,
  getCatalogItems,
} from "@/features/avatar/avatarCatalog";
import type {
  AvatarConfig,
  AvatarConfigCandidate,
  AvatarItemDefinition,
  AvatarItemId,
  AvatarSelectableCategory,
} from "@/features/avatar/avatar.types";

function isCatalogItem<TId extends AvatarItemId>(
  items: readonly AvatarItemDefinition<TId>[],
  id: string | null | undefined,
): id is TId {
  return Boolean(id && items.some((item) => item.id === id));
}

export function resolveAvatarConfig(candidate: AvatarConfigCandidate | null): AvatarConfig {
  return {
    bodyId: isCatalogItem(AVATAR_CATALOG.body, candidate?.bodyId)
      ? candidate.bodyId
      : DEFAULT_AVATAR_CONFIG.bodyId,
    hairId: isCatalogItem(AVATAR_CATALOG.hair, candidate?.hairId)
      ? candidate.hairId
      : DEFAULT_AVATAR_CONFIG.hairId,
    topId: isCatalogItem(AVATAR_CATALOG.top, candidate?.topId)
      ? candidate.topId
      : DEFAULT_AVATAR_CONFIG.topId,
    bottomId: isCatalogItem(AVATAR_CATALOG.bottom, candidate?.bottomId)
      ? candidate.bottomId
      : DEFAULT_AVATAR_CONFIG.bottomId,
    accessoryId:
      candidate?.accessoryId === null
        ? null
        : isCatalogItem(AVATAR_CATALOG.accessory, candidate?.accessoryId)
          ? candidate.accessoryId
          : DEFAULT_AVATAR_CONFIG.accessoryId,
  };
}

export function getOwnedAvatarItems(
  category: AvatarSelectableCategory,
  ownedIds: ReadonlySet<AvatarItemId> = DEFAULT_OWNED_AVATAR_ITEM_IDS,
): readonly AvatarItemDefinition[] {
  return getCatalogItems(category).filter((item) => ownedIds.has(item.id));
}

export function selectOwnedAvatarItem(
  config: AvatarConfig,
  category: AvatarSelectableCategory,
  itemId: AvatarItemId | null,
  ownedIds: ReadonlySet<AvatarItemId> = DEFAULT_OWNED_AVATAR_ITEM_IDS,
): AvatarConfig {
  if (category === "accessory" && itemId === null) {
    return { ...config, accessoryId: null };
  }

  if (category === "hair") {
    const item = AVATAR_CATALOG.hair.find((candidate) => candidate.id === itemId);
    if (!item || !ownedIds.has(item.id)) throw new Error("Only an owned Avatar item in the selected category can be equipped");
    return { ...config, hairId: item.id };
  }
  if (category === "top") {
    const item = AVATAR_CATALOG.top.find((candidate) => candidate.id === itemId);
    if (!item || !ownedIds.has(item.id)) throw new Error("Only an owned Avatar item in the selected category can be equipped");
    return { ...config, topId: item.id };
  }
  if (category === "bottom") {
    const item = AVATAR_CATALOG.bottom.find((candidate) => candidate.id === itemId);
    if (!item || !ownedIds.has(item.id)) throw new Error("Only an owned Avatar item in the selected category can be equipped");
    return { ...config, bottomId: item.id };
  }
  const item = AVATAR_CATALOG.accessory.find((candidate) => candidate.id === itemId);
  if (!item || !ownedIds.has(item.id)) throw new Error("Only an owned Avatar item in the selected category can be equipped");
  return { ...config, accessoryId: item.id };
}

export function getSelectedAvatarItemId(
  config: AvatarConfig,
  category: AvatarSelectableCategory,
): AvatarItemId | null {
  if (category === "hair") return config.hairId;
  if (category === "top") return config.topId;
  if (category === "bottom") return config.bottomId;
  return config.accessoryId;
}
