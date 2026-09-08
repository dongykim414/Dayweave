import { DEFAULT_AVATAR_CONFIG } from "@/features/avatar/avatarCatalog";
import {
  AVATAR_LAYER_ORDER,
  AVATAR_VISUAL_REGISTRY,
  resolveAvatarLayers,
} from "@/features/avatar/avatarVisualRegistry";

describe("Avatar visual registry", () => {
  it("resolves every default selection without dynamic asset lookup", () => {
    expect(AVATAR_VISUAL_REGISTRY[DEFAULT_AVATAR_CONFIG.bodyId]).toBeDefined();
    expect(AVATAR_VISUAL_REGISTRY[DEFAULT_AVATAR_CONFIG.hairId]).toBeDefined();
    expect(AVATAR_VISUAL_REGISTRY[DEFAULT_AVATAR_CONFIG.topId]).toBeDefined();
    expect(AVATAR_VISUAL_REGISTRY[DEFAULT_AVATAR_CONFIG.bottomId]).toBeDefined();
  });

  it("returns layers in the documented z-order and supports no accessory", () => {
    const layers = resolveAvatarLayers(DEFAULT_AVATAR_CONFIG);
    expect(AVATAR_LAYER_ORDER).toEqual([
      "hairBack",
      "body",
      "bottom",
      "top",
      "hairFront",
      "accessory",
    ]);
    expect(layers.body.length).toBeGreaterThan(0);
    expect(layers.hairBack.length).toBeGreaterThan(0);
    expect(layers.hairFront.length).toBeGreaterThan(0);
    expect(layers.accessory).toEqual([]);
  });
});
