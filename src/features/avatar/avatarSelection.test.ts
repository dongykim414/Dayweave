import {
  DEFAULT_AVATAR_CONFIG,
  DEFAULT_OWNED_AVATAR_ITEM_IDS,
} from "@/features/avatar/avatarCatalog";
import {
  getOwnedAvatarItems,
  resolveAvatarConfig,
  selectOwnedAvatarItem,
} from "@/features/avatar/avatarSelection";
import type { AvatarItemId } from "@/features/avatar/avatar.types";

describe("Avatar Catalog, Ownership, and Selection", () => {
  it("creates a valid default config and supports no accessory", () => {
    expect(resolveAvatarConfig(null)).toEqual(DEFAULT_AVATAR_CONFIG);
    expect(DEFAULT_AVATAR_CONFIG.accessoryId).toBeNull();
  });

  it("falls back per slot when persisted IDs are invalid", () => {
    expect(
      resolveAvatarConfig({
        bodyId: "body_removed",
        hairId: "hair_removed",
        topId: "top_mint_sweater",
        bottomId: "bottom_removed",
        accessoryId: "accessory_removed",
      }),
    ).toEqual({ ...DEFAULT_AVATAR_CONFIG, topId: "top_mint_sweater" });
  });

  it("filters the Catalog through Ownership", () => {
    const owned = new Set<AvatarItemId>(["hair_long_wave"]);
    expect(getOwnedAvatarItems("hair", owned).map((item) => item.id)).toEqual([
      "hair_long_wave",
    ]);
  });

  it("changes one selected slot while preserving the others", () => {
    expect(
      selectOwnedAvatarItem(DEFAULT_AVATAR_CONFIG, "hair", "hair_long_wave"),
    ).toEqual({ ...DEFAULT_AVATAR_CONFIG, hairId: "hair_long_wave" });
  });

  it("rejects a catalog item that is not owned", () => {
    const owned = new Set(DEFAULT_OWNED_AVATAR_ITEM_IDS);
    owned.delete("hair_long_wave");
    expect(() =>
      selectOwnedAvatarItem(
        DEFAULT_AVATAR_CONFIG,
        "hair",
        "hair_long_wave",
        owned,
      ),
    ).toThrow("owned Avatar item");
  });

  it("removes only the accessory with null selection", () => {
    const withAccessory = selectOwnedAvatarItem(
      DEFAULT_AVATAR_CONFIG,
      "accessory",
      "accessory_round_glasses",
    );
    expect(selectOwnedAvatarItem(withAccessory, "accessory", null)).toEqual(
      DEFAULT_AVATAR_CONFIG,
    );
  });
});
