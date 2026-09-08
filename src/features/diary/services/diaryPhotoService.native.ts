import * as Crypto from "expo-crypto";
import { Directory, File, Paths } from "expo-file-system";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import type {
  DiaryPhoto,
  PreparedDiaryPhoto,
} from "@/features/diary/model/diaryPhoto.types";
import type { DiaryEntryId } from "@/features/diary/model/diary.types";
import type { DiaryPhotoSelectionResult } from "@/features/diary/services/diaryPhotoService";

const MAX_DISPLAY_EDGE = 1600;
const JPEG_COMPRESSION = 0.8;

function getResizeTarget(width: number, height: number) {
  if (Math.max(width, height) <= MAX_DISPLAY_EDGE) {
    return null;
  }

  return width >= height
    ? { width: MAX_DISPLAY_EDGE }
    : { height: MAX_DISPLAY_EDGE };
}

function deleteFileIfPresent(uri: string): void {
  const file = new File(uri);

  if (file.exists) {
    file.delete();
  }
}

export async function selectDiaryPhoto(): Promise<DiaryPhotoSelectionResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return { status: "permission-denied" };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: false,
    base64: false,
    exif: false,
    mediaTypes: ["images"],
    quality: 1,
    selectionLimit: 1,
  });

  if (result.canceled) {
    return { status: "cancelled" };
  }

  const asset = result.assets[0];

  if (!asset?.uri || asset.width <= 0 || asset.height <= 0) {
    throw new Error("Image picker returned an invalid image asset");
  }

  const context = ImageManipulator.manipulate(asset.uri);
  const resizeTarget = getResizeTarget(asset.width, asset.height);

  if (resizeTarget) {
    context.resize(resizeTarget);
  }

  const renderedImage = await context.renderAsync();
  const savedImage = await renderedImage.saveAsync({
    compress: JPEG_COMPRESSION,
    format: SaveFormat.JPEG,
  });

  return {
    status: "selected",
    photo: {
      id: Crypto.randomUUID(),
      previewUri: savedImage.uri,
      width: savedImage.width,
      height: savedImage.height,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function persistPreparedDiaryPhoto(
  preparedPhoto: PreparedDiaryPhoto,
  diaryEntryId: DiaryEntryId,
): Promise<DiaryPhoto> {
  const photoDirectory = new Directory(Paths.document, "diary", "photos");
  photoDirectory.create({ idempotent: true, intermediates: true });

  const source = new File(preparedPhoto.previewUri);
  const destination = new File(photoDirectory, `${preparedPhoto.id}.jpg`);

  try {
    await source.copy(destination);
  } catch (caughtError) {
    if (destination.exists) {
      destination.delete();
    }
    throw caughtError;
  }

  return {
    id: preparedPhoto.id,
    diaryEntryId,
    localUri: destination.uri,
    width: preparedPhoto.width,
    height: preparedPhoto.height,
    createdAt: preparedPhoto.createdAt,
  };
}

export async function discardPreparedDiaryPhoto(
  preparedPhoto: PreparedDiaryPhoto,
): Promise<void> {
  deleteFileIfPresent(preparedPhoto.previewUri);
}

export async function deletePersistedDiaryPhoto(
  photo: DiaryPhoto,
): Promise<void> {
  deleteFileIfPresent(photo.localUri);
}

export async function isDiaryPhotoFileAvailable(
  photo: DiaryPhoto,
): Promise<boolean> {
  return new File(photo.localUri).exists;
}
