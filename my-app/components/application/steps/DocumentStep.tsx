"use client";

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
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#123451] mb-6">Document</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-600"
          />
          <p className="text-xs text-gray-600 mt-1">
            Upload Only Image Format: .jpg, .jpeg, .png (Max: 200 KB)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="block w-full text-sm text-gray-600"
          />
          <p className="text-xs text-gray-600 mt-1">
            Upload Only: .pdf, .doc, .docx (Max: 300 KB)
          </p>
        </div>
      </div>
    </div>
  );
}
