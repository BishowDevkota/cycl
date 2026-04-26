import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
}

export async function uploadToCloudinary(
  file: Buffer,
  fileName: string,
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "hero-sections",
        public_id: fileName.replace(/\.[^/.]+$/, ""),
      },
      (error, result) => {
        if (error) {
          reject(new Error("Failed to upload image to Cloudinary"));
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error("Upload completed but no result returned"));
        }
      },
    );

    uploadStream.end(file);
  });
}
