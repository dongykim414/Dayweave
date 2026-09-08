import { DEFAULT_AVATAR_CONFIG } from "@/features/avatar/avatarCatalog";
import { toAvatarConfig } from "@/features/avatar/data/avatarConfigMapper";

describe("Avatar config persistence mapping", () => {
  it("maps stored columns to semantic selection IDs", () => {
    expect(
      toAvatarConfig({
        body_id: "body_default",
        hair_id: "hair_long_wave",
        top_id: "top_mint_sweater",
        bottom_id: "bottom_sand_skirt",
        accessory_id: "accessory_star_pin",
        updated_at: "2026-09-09T00:00:00.000Z",
      }),
    ).toEqual({
      bodyId: "body_default",
      hairId: "hair_long_wave",
      topId: "top_mint_sweater",
      bottomId: "bottom_sand_skirt",
      accessoryId: "accessory_star_pin",
    });
  });

  it("repairs removed stored IDs with slot defaults", () => {
    expect(
      toAvatarConfig({
        body_id: "removed",
        hair_id: "removed",
        top_id: "removed",
        bottom_id: "removed",
        accessory_id: "removed",
        updated_at: "2026-09-09T00:00:00.000Z",
      }),
    ).toEqual(DEFAULT_AVATAR_CONFIG);
  });
});
