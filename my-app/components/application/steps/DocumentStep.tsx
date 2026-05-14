"use client";

import { useEffect, useState } from "react";

interface DocumentStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function DocumentStep({
  formData,
  onUpdate,
  vacancyId,
}: DocumentStepProps) {
  const [localData, setLocalData] = useState(formData.documents || {});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    setLocalData(formData.documents || {});
  }, [formData.documents]);

  useEffect(() => {
    const photo = localData.photo;

    if (!photo) {
      setPhotoPreview(null);
      return;
    }

    if (typeof photo === "string") {
      setPhotoPreview(photo);
      return;
    }

    if (photo instanceof File) {
      const previewUrl = URL.createObjectURL(photo);
      setPhotoPreview(previewUrl);

      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    }

    if (photo.dataUrl) {
      setPhotoPreview(photo.dataUrl);
    }
  }, [localData.photo]);

  const handleFileChange = (field: "photo" | "cv", fileList: FileList | null) => {
    const file = fileList?.[0] || null;
    const updated = {
      ...localData,
      [field]: file,
    };
    setLocalData(updated);
    onUpdate("documents", updated);
    // If photo selected, create preview URL
    if (field === "photo" && file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#123451] mb-6">कागजात</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            फोटो <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange("photo", e.target.files)}
            className="block w-full text-sm text-gray-600"
            aria-label="photo-file-input"
          />
          <p className="text-xs text-gray-600 mt-1">
            केवल इमेज ढाँचा अपलोड गर्नुहोस्: .jpg, .jpeg, .png (अधिकतम: 200 KB)
          </p>
          {localData.photo && (
            <p className="mt-2 text-sm text-gray-700">Selected: {localData.photo.name}</p>
          )}
          {photoPreview && (
            <img src={photoPreview} alt="photo preview" className="mt-3 w-28 h-28 object-cover rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            सीभी <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange("cv", e.target.files)}
            className="block w-full text-sm text-gray-600"
            aria-label="cv-file-input"
          />
          <p className="text-xs text-gray-600 mt-1">
            केवल .pdf, .doc, .docx फाइल अपलोड गर्नुहोस् (अधिकतम: 300 KB)
          </p>
          {localData.cv && (
            <p className="mt-2 text-sm text-gray-700">Selected: {localData.cv.name}</p>
          )}
        </div>
      </div>
    </div>
  );
}
