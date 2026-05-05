"use client";

import { useState } from "react";
import { useVacancyLanguage } from "@/components/vacancy/VacancyLanguageContext";

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
  const { t } = useVacancyLanguage();
  const [experiences, setExperiences] = useState(formData.experience || []);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      organization: "",
      department: "",
      position: "",
      serviceFrom: "",
      serviceTo: "",
      organizationNepali: "",
      departmentNepali: "",
      positionNepali: "",
    };
    const updated = [...experiences, newExperience];
    setExperiences(updated);
    onUpdate("experience", updated);
  };

  const updateExperience = (id: number, field: string, value: string) => {
    const updated = experiences.map((exp: any) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setExperiences(updated);
    onUpdate("experience", updated);

    // Validate Nepali fields
    const nepaliFields = ["organizationNepali", "departmentNepali", "positionNepali"];
    const newErrors = { ...errors };
    if (nepaliFields.includes(field)) {
      const key = `exp_${id}_${field}`;
      if (!value.trim()) {
        newErrors[key] = t("vacancy.required");
      } else {
        delete newErrors[key];
      }
    }
    setErrors(newErrors);
  };

  const removeExperience = (id: number) => {
    const updated = experiences.filter((exp: any) => exp.id !== id);
    setExperiences(updated);
    onUpdate("experience", updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#123451] mb-6">{t("vacancy.experience")}</h2>

      {experiences.length > 0 && (
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm border border-[#d6e6ed]">
            <thead>
              <tr className="bg-[#f9fcfe] border-b border-[#d6e6ed]">
                <th className="px-4 py-2 text-left">{t("vacancy.organization")}</th>
                <th className="px-4 py-2 text-left">{t("vacancy.department")}</th>
                <th className="px-4 py-2 text-left">{t("vacancy.position")}</th>
                <th className="px-4 py-2 text-left">{t("vacancy.action")}</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map((exp: any) => (
                <tr key={exp.id} className="border-b border-[#d6e6ed]">
                  <td className="px-4 py-2">{exp.organization}</td>
                  <td className="px-4 py-2">{exp.department}</td>
                  <td className="px-4 py-2">{exp.position}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => removeExperience(exp.id)}
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
          onClick={() => {
            addExperience();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#0d837f] text-white rounded font-medium hover:bg-[#08716e] transition"
        >
          {t("vacancy.addExperience")}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#f9fcfe] p-6 rounded border border-[#d6e6ed] space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">{t("vacancy.experience")} (English)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.organization")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("vacancy.organization")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (experiences.length > 0) {
                      updateExperience(experiences[experiences.length - 1].id, "organization", e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.department")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("vacancy.department")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (experiences.length > 0) {
                      updateExperience(experiences[experiences.length - 1].id, "department", e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.position")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t("vacancy.position")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (experiences.length > 0) {
                      updateExperience(experiences[experiences.length - 1].id, "position", e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.serviceFrom")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (experiences.length > 0) {
                      updateExperience(experiences[experiences.length - 1].id, "serviceFrom", e.target.value);
                    }
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.serviceTo")}
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f]"
                  onChange={(e) => {
                    if (experiences.length > 0) {
                      updateExperience(experiences[experiences.length - 1].id, "serviceTo", e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {experiences.length > 0 && (
            <div className="border-t border-[#d6e6ed] pt-4 mt-4">
              <h4 className="font-semibold mb-2 text-indigo-600">{t("vacancy.experience")} (नेपालीमा)</h4>
              <p className="text-xs text-indigo-600 mb-3">* {t("vacancy.required")}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.organizationNepali")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.organizationNepali")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] ${
                      errors[`exp_${experiences[experiences.length - 1]?.id}_organizationNepali`]
                        ? "border-red-500"
                        : "border-[#cfdfe6]"
                    }`}
                    onChange={(e) => {
                      if (experiences.length > 0) {
                        updateExperience(experiences[experiences.length - 1].id, "organizationNepali", e.target.value);
                      }
                    }}
                  />
                  {errors[`exp_${experiences[experiences.length - 1]?.id}_organizationNepali`] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[`exp_${experiences[experiences.length - 1]?.id}_organizationNepali`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.departmentNepali")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.departmentNepali")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] ${
                      errors[`exp_${experiences[experiences.length - 1]?.id}_departmentNepali`]
                        ? "border-red-500"
                        : "border-[#cfdfe6]"
                    }`}
                    onChange={(e) => {
                      if (experiences.length > 0) {
                        updateExperience(experiences[experiences.length - 1].id, "departmentNepali", e.target.value);
                      }
                    }}
                  />
                  {errors[`exp_${experiences[experiences.length - 1]?.id}_departmentNepali`] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[`exp_${experiences[experiences.length - 1]?.id}_departmentNepali`]}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.positionNepali")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={t("vacancy.positionNepali")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] ${
                      errors[`exp_${experiences[experiences.length - 1]?.id}_positionNepali`]
                        ? "border-red-500"
                        : "border-[#cfdfe6]"
                    }`}
                    onChange={(e) => {
                      if (experiences.length > 0) {
                        updateExperience(experiences[experiences.length - 1].id, "positionNepali", e.target.value);
                      }
                    }}
                  />
                  {errors[`exp_${experiences[experiences.length - 1]?.id}_positionNepali`] && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors[`exp_${experiences[experiences.length - 1]?.id}_positionNepali`]}
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
  );
}
