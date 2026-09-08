import { DEFAULT_AVATAR_CONFIG } from "@/features/avatar/avatarCatalog";
import { LocalStorageAvatarRepository } from "@/features/avatar/data/LocalStorageAvatarRepository";

class MemoryStorage {
  private readonly values = new Map<string, string>();
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("LocalStorageAvatarRepository", () => {
  it("persists one current Avatar config", async () => {
    const repository = new LocalStorageAvatarRepository(new MemoryStorage());
    expect(await repository.getConfig()).toBeNull();

    await repository.saveConfig(DEFAULT_AVATAR_CONFIG);
    await repository.saveConfig({
      ...DEFAULT_AVATAR_CONFIG,
      hairId: "hair_long_wave",
    });

    await expect(repository.getConfig()).resolves.toEqual({
      ...DEFAULT_AVATAR_CONFIG,
      hairId: "hair_long_wave",
    });
  });
});
