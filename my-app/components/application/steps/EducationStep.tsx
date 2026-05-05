"use client";

import { useState, useEffect } from "react";
import { useVacancyLanguage } from "@/components/vacancy/VacancyLanguageContext";

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
  const { t } = useVacancyLanguage();
  const [educations, setEducations] = useState(formData.education || []);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      universityNepali: "",
      institutionNepali: "",
      degreeNepali: "",
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

    // Validate Nepali fields
    const nepaliFields = ["universityNepali", "institutionNepali", "degreeNepali"];
    const newErrors = { ...errors };
    if (nepaliFields.includes(field)) {
      const key = `edu_${id}_${field}`;
      if (!value.trim()) {
        newErrors[key] = t("vacancy.required");
      } else {
        delete newErrors[key];
      }
    }
    setErrors(newErrors);
  };

  const removeEducation = (id: number) => {
    const updated = educations.filter((edu: any) => edu.id !== id);
    setEducations(updated);
    onUpdate("education", updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#123451] mb-6">{t("vacancy.education")}</h2>

        {educations.length > 0 && (
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-sm border border-[#d6e6ed]">
              <thead>
                <tr className="bg-[#f9fcfe] border-b border-[#d6e6ed]">
                  <th className="px-4 py-2 text-left">{t("vacancy.university")}</th>
                  <th className="px-4 py-2 text-left">{t("vacancy.institution")}</th>
                  <th className="px-4 py-2 text-left">{t("vacancy.degree")}</th>
                  <th className="px-4 py-2 text-left">{t("vacancy.action")}</th>
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
                        {t("vacancy.delete")}
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
            {t("vacancy.addEducation")}
          </button>
        </div>

        {showForm && (
          <div className="bg-[#f9fcfe] p-6 rounded border border-[#d6e6ed] space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">{t("vacancy.education")} (English)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.university")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.university")}
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
                    {t("vacancy.institution")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.institution")}
                    className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                    onChange={(e) => {
                      if (educations.length > 0) {
                        updateEducation(educations[educations.length - 1].id, "institution", e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.degree")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.degree")}
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
                    {t("vacancy.faculty")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.faculty")}
                    className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                    onChange={(e) => {
                      if (educations.length > 0) {
                        updateEducation(educations[educations.length - 1].id, "faculty", e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {educations.length > 0 && (
              <div className="border-t border-[#d6e6ed] pt-4 mt-4">
                {/* Nepali Education Section */}
                <h4 className="font-semibold mb-2 text-indigo-600">{t("vacancy.educationNepali")}</h4>
                <p className="text-xs text-indigo-600 mb-3">* {t("vacancy.required")}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("vacancy.universityNepali")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("vacancy.universityNepali")}
                      className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] ${
                        errors[`edu_${educations[educations.length - 1]?.id}_universityNepali`]
                          ? "border-red-500"
                          : "border-[#cfdfe6]"
                      }`}
                      onChange={(e) => {
                        if (educations.length > 0) {
                          updateEducation(educations[educations.length - 1].id, "universityNepali", e.target.value);
                        }
                      }}
                    />
                    {errors[`edu_${educations[educations.length - 1]?.id}_universityNepali`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`edu_${educations[educations.length - 1]?.id}_universityNepali`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("vacancy.institutionNepali")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("vacancy.institutionNepali")}
                      className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] ${
                        errors[`edu_${educations[educations.length - 1]?.id}_institutionNepali`]
                          ? "border-red-500"
                          : "border-[#cfdfe6]"
                      }`}
                      onChange={(e) => {
                        if (educations.length > 0) {
                          updateEducation(educations[educations.length - 1].id, "institutionNepali", e.target.value);
                        }
                      }}
                    />
                    {errors[`edu_${educations[educations.length - 1]?.id}_institutionNepali`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`edu_${educations[educations.length - 1]?.id}_institutionNepali`]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("vacancy.degreeNepali")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={t("vacancy.degreeNepali")}
                      className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] ${
                        errors[`edu_${educations[educations.length - 1]?.id}_degreeNepali`]
                          ? "border-red-500"
                          : "border-[#cfdfe6]"
                      }`}
                      onChange={(e) => {
                        if (educations.length > 0) {
                          updateEducation(educations[educations.length - 1].id, "degreeNepali", e.target.value);
                        }
                      }}
                    />
                    {errors[`edu_${educations[educations.length - 1]?.id}_degreeNepali`] && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors[`edu_${educations[educations.length - 1]?.id}_degreeNepali`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setShowForm(false);
                setErrors({});
              }}
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
