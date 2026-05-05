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

  useEffect(() => {
    setLocalData(formData.documents || {});
  }, [formData.documents]);

  const handleFileChange = (field: "photo" | "cv", fileList: FileList | null) => {
    const file = fileList?.[0] || null;
    const updated = {
      ...localData,
      [field]: file,
    };
    setLocalData(updated);
    onUpdate("documents", updated);
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
          />
          <p className="text-xs text-gray-600 mt-1">
            केवल इमेज ढाँचा अपलोड गर्नुहोस्: .jpg, .jpeg, .png (अधिकतम: 200 KB)
          </p>
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
          />
          <p className="text-xs text-gray-600 mt-1">
            केवल .pdf, .doc, .docx फाइल अपलोड गर्नुहोस् (अधिकतम: 300 KB)
          </p>
        </div>
      </div>
    </div>
  );
}
