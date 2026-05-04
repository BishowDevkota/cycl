"use client";

import { useState, useEffect } from "react";

interface EducationStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function EducationStep({
  formData,
  onUpdate,
  vacancyId,
}: EducationStepProps) {
  const [educations, setEducations] = useState(formData.education || []);
  const [showForm, setShowForm] = useState(false);

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      university: "",
      institution: "",
      degree: "",
      faculty: "",
      marks: "",
      division: "",
      subjects: "",
    };
    const updated = [...educations, newEducation];
    setEducations(updated);
    onUpdate("education", updated);
  };

  const updateEducation = (id: number, field: string, value: string) => {
    const updated = educations.map((edu: any) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setEducations(updated);
    onUpdate("education", updated);
  };

  const removeEducation = (id: number) => {
    const updated = educations.filter((edu: any) => edu.id !== id);
    setEducations(updated);
    onUpdate("education", updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#123451] mb-6">Education</h2>

        {educations.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm border border-[#d6e6ed]">
              <thead>
                <tr className="bg-[#f9fcfe] border-b border-[#d6e6ed]">
                  <th className="px-4 py-2 text-left">University/Board</th>
                  <th className="px-4 py-2 text-left">Institution</th>
                  <th className="px-4 py-2 text-left">Degree</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu: any) => (
                  <tr key={edu.id} className="border-b border-[#d6e6ed]">
                    <td className="px-4 py-2">{edu.university}</td>
                    <td className="px-4 py-2">{edu.institution}</td>
                    <td className="px-4 py-2">{edu.degree}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-[#0d837f] text-white rounded font-medium hover:bg-[#08716e] transition"
          >
            + Add Education Detail
          </button>
        </div>

        {showForm && (
          <div className="bg-[#f9fcfe] p-6 rounded border border-[#d6e6ed] space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University/Board Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="University/Board name"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (educations.length > 0) {
                      updateEducation(educations[educations.length - 1].id, "university", e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Institution"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (educations.length > 0) {
                      updateEducation(educations[educations.length - 1].id, "institution", e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Degree"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (educations.length > 0) {
                      updateEducation(educations[educations.length - 1].id, "degree", e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty
                </label>
                <input
                  type="text"
                  placeholder="Faculty"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (educations.length > 0) {
                      updateEducation(educations[educations.length - 1].id, "faculty", e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded font-medium hover:bg-gray-500 transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
