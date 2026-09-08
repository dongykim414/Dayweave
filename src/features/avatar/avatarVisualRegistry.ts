import { DEFAULT_AVATAR_CONFIG } from "@/features/avatar/avatarCatalog";
import { resolveAvatarConfig } from "@/features/avatar/avatarSelection";
import type {
  AvatarConfig,
  AvatarItemId,
  AvatarLayerPrimitive,
  AvatarLayerSlot,
  AvatarVisualDefinition,
} from "@/features/avatar/avatar.types";

export const AVATAR_CANVAS_SIZE = 320;
export const AVATAR_LAYER_ORDER: readonly AvatarLayerSlot[] = [
  "hairBack",
  "body",
  "bottom",
  "top",
  "hairFront",
  "accessory",
];

const PALETTE = {
  skin: "#F2C7A5",
  skinShadow: "#DFAE89",
  brown: "#6B4636",
  cocoa: "#4D332A",
  gold: "#E7B84B",
  denim: "#6383A8",
  sand: "#CFAF82",
  cloud: "#F8FBFD",
  sky: "#9CC9EA",
  mint: "#91CBB8",
  lilac: "#B5A2D6",
  ink: "#405064",
} as const;

const rounded = (
  left: number,
  top: number,
  width: number,
  height: number,
  backgroundColor: string,
  borderRadius = 20,
): AvatarLayerPrimitive => ({
  backgroundColor,
  borderRadius,
  height,
  left,
  top,
  width,
});

export const AVATAR_VISUAL_REGISTRY: Record<AvatarItemId, AvatarVisualDefinition> = {
  body_default: {
    body: [
      rounded(110, 42, 100, 106, PALETTE.skin, 50),
      rounded(146, 132, 28, 34, PALETTE.skinShadow, 12),
      rounded(88, 154, 144, 102, PALETTE.skin, 46),
      rounded(72, 166, 28, 92, PALETTE.skin, 14),
      rounded(220, 166, 28, 92, PALETTE.skin, 14),
      rounded(133, 91, 12, 12, PALETTE.ink, 6),
      rounded(175, 91, 12, 12, PALETTE.ink, 6),
      rounded(150, 116, 20, 7, PALETTE.skinShadow, 4),
    ],
  },
  hair_soft_bob: {
    hairBack: [rounded(94, 24, 132, 150, PALETTE.brown, 64)],
    hairFront: [
      rounded(104, 25, 112, 54, PALETTE.brown, 36),
      rounded(99, 57, 27, 72, PALETTE.brown, 18),
      rounded(194, 57, 27, 72, PALETTE.brown, 18),
    ],
  },
  hair_long_wave: {
    hairBack: [
      rounded(86, 22, 148, 224, PALETTE.cocoa, 66),
      rounded(76, 112, 42, 144, PALETTE.cocoa, 22),
      rounded(202, 112, 42, 144, PALETTE.cocoa, 22),
    ],
    hairFront: [
      rounded(101, 22, 118, 56, PALETTE.cocoa, 38),
      rounded(102, 52, 32, 70, PALETTE.cocoa, 18),
      rounded(186, 52, 32, 70, PALETTE.cocoa, 18),
    ],
  },
  hair_short_crop: {
    hairBack: [rounded(104, 27, 112, 80, PALETTE.ink, 46)],
    hairFront: [
      rounded(105, 25, 110, 49, PALETTE.ink, 30),
      rounded(115, 58, 90, 24, PALETTE.ink, 12),
    ],
  },
  top_cloud_tee: {
    top: [
      rounded(96, 154, 128, 92, PALETTE.cloud, 28),
      rounded(88, 159, 36, 53, PALETTE.sky, 16),
      rounded(196, 159, 36, 53, PALETTE.sky, 16),
      rounded(142, 184, 36, 22, PALETTE.sky, 11),
    ],
  },
  top_mint_sweater: {
    top: [
      rounded(91, 151, 138, 105, PALETTE.mint, 31),
      rounded(76, 158, 43, 88, PALETTE.mint, 20),
      rounded(201, 158, 43, 88, PALETTE.mint, 20),
      rounded(140, 151, 40, 19, PALETTE.cloud, 10),
    ],
  },
  top_lilac_cardigan: {
    top: [
      rounded(91, 153, 138, 103, PALETTE.lilac, 29),
      rounded(78, 160, 42, 84, PALETTE.lilac, 18),
      rounded(200, 160, 42, 84, PALETTE.lilac, 18),
      rounded(154, 158, 12, 95, PALETTE.cloud, 6),
    ],
  },
  bottom_denim: {
    bottom: [
      rounded(102, 226, 54, 82, PALETTE.denim, 17),
      rounded(164, 226, 54, 82, PALETTE.denim, 17),
      rounded(99, 218, 122, 38, PALETTE.denim, 18),
    ],
  },
  bottom_sand_skirt: {
    bottom: [
      rounded(96, 219, 128, 78, PALETTE.sand, 24),
      rounded(107, 284, 42, 24, PALETTE.skin, 13),
      rounded(171, 284, 42, 24, PALETTE.skin, 13),
    ],
  },
  accessory_round_glasses: {
    accessory: [
      { ...rounded(120, 81, 42, 34, "transparent", 17), borderColor: PALETTE.ink, borderWidth: 4 },
      { ...rounded(158, 81, 42, 34, "transparent", 17), borderColor: PALETTE.ink, borderWidth: 4 },
      rounded(156, 94, 10, 4, PALETTE.ink, 2),
    ],
  },
  accessory_star_pin: {
    accessory: [
      { ...rounded(198, 42, 24, 24, PALETTE.gold, 5), rotate: "45deg" },
      rounded(204, 48, 12, 12, PALETTE.cloud, 6),
    ],
  },
};

export function resolveAvatarLayers(config: AvatarConfig): Record<AvatarLayerSlot, readonly AvatarLayerPrimitive[]> {
  const safe = resolveAvatarConfig(config);
  const itemIds: readonly AvatarItemId[] = [
    safe.bodyId,
    safe.hairId,
    safe.bottomId,
    safe.topId,
    ...(safe.accessoryId ? [safe.accessoryId] : []),
  ];

  return AVATAR_LAYER_ORDER.reduce<Record<AvatarLayerSlot, readonly AvatarLayerPrimitive[]>>(
    (layers, slot) => {
      layers[slot] = itemIds.flatMap(
        (itemId) => AVATAR_VISUAL_REGISTRY[itemId]?.[slot] ?? [],
      );
      return layers;
    },
    { hairBack: [], body: [], bottom: [], top: [], hairFront: [], accessory: [] },
  );
}

export function getAvatarItemPreviewColor(itemId: AvatarItemId): string {
  const definition = AVATAR_VISUAL_REGISTRY[itemId];
  for (const slot of AVATAR_LAYER_ORDER) {
    const color = definition[slot]?.find(
      (primitive) => primitive.backgroundColor && primitive.backgroundColor !== "transparent",
    )?.backgroundColor;
    if (color) return color;
  }
  return PALETTE.sky;
}

export function createDefaultAvatarLayers() {
  return resolveAvatarLayers(DEFAULT_AVATAR_CONFIG);
}
