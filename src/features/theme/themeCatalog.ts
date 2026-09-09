import { DEFAULT_THEME_ID, resolveTheme } from "@/features/theme/themeRegistry";
import type { ThemeId } from "@/features/theme/theme.types";

export interface ThemeCatalogItem {
  id: ThemeId;
  displayName: string;
  isDefault: boolean;
}

export const THEME_CATALOG: readonly ThemeCatalogItem[] = [
  { id: "sky", displayName: "Sky", isDefault: true },
  { id: "warm-paper", displayName: "Warm Paper", isDefault: false },
  { id: "night", displayName: "Night", isDefault: false },
];

export const DEFAULT_OWNED_THEME_IDS: ReadonlySet<ThemeId> = new Set(
  THEME_CATALOG.map((item) => item.id),
);

export function resolveThemeId(value: string | null | undefined): ThemeId {
  return resolveTheme(value).id;
}

export function getOwnedThemes(
  ownedIds: ReadonlySet<ThemeId> = DEFAULT_OWNED_THEME_IDS,
): readonly ThemeCatalogItem[] {
  return THEME_CATALOG.filter((item) => ownedIds.has(item.id));
}

export function selectOwnedTheme(
  themeId: ThemeId,
  ownedIds: ReadonlySet<ThemeId> = DEFAULT_OWNED_THEME_IDS,
): ThemeId {
  if (!ownedIds.has(themeId)) throw new Error("Only an owned Theme can be selected");
  return themeId;
}

export { DEFAULT_THEME_ID };
