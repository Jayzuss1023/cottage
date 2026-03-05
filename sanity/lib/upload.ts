"use server";

import { client } from "./client";

export interface UploadedImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

export async function uploadImageToSanity(
  formData: FormData,
): Promise<UploadedImage> {
  const file = formData.get("file") as File;

  if (!file) {
    throw new Error("No file provided");
  }

  // Convert File to Buffer to Sanity upload
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Sanity assets
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name,
    contentType: file.type,
  });

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}
