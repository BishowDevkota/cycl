"use client";

interface ExperienceStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function ExperienceStep({
  formData,
  onUpdate,
  vacancyId,
}: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#123451] mb-6">Experience</h2>
      <p className="text-gray-600">Add your work experience details</p>
      <div className="bg-[#f9fcfe] p-6 rounded border border-[#d6e6ed]">
        <button className="px-4 py-2 bg-[#0d837f] text-white rounded font-medium hover:bg-[#08716e] transition">
          + Add Experience
        </button>
      </div>
    </div>
  );
}
