"use client";

import { useState, useEffect } from "react";
import { useVacancyLanguage } from "@/components/vacancy/VacancyLanguageContext";

interface BasicDetailsStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function BasicDetailsStep({
  formData,
  onUpdate,
  vacancyId,
}: BasicDetailsStepProps) {
  const { t } = useVacancyLanguage();
  const [localData, setLocalData] = useState(formData.personalDetails || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalData(formData.personalDetails || {});
  }, [formData.personalDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...localData, [name]: value };
    setLocalData(updated);
    onUpdate("personalDetails", updated);

    // Validate Nepali fields - required to be filled
    const newErrors = { ...errors };
    if (
      name === "firstNameNepali" ||
      name === "lastNameNepali"
    ) {
      if (!value.trim()) {
        newErrors[name] = t("vacancy.required");
      } else {
        delete newErrors[name];
      }
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#123451] mb-6">{t("vacancy.personalDetail")}</h2>

        {/* Name (In English) */}
        <div className="mb-6 pb-6 border-b border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">{t("vacancy.nameEnglish")}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.firstName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={localData.firstName || ""}
                onChange={handleChange}
                placeholder={t("vacancy.firstName")}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.middleName")}
              </label>
              <input
                type="text"
                name="middleName"
                value={localData.middleName || ""}
                onChange={handleChange}
                placeholder={t("vacancy.middleName")}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.lastName")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={localData.lastName || ""}
                onChange={handleChange}
                placeholder={t("vacancy.lastName")}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
          </div>
        </div>

        {/* Name (In Nepali) */}
        <div className="mb-6 pb-6 border-b border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">{t("vacancy.nameNepali")}</h3>
          <p className="text-xs text-indigo-600 mb-3">* {t("vacancy.required")}</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.firstNamePreeti")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstNameNepali"
                value={localData.firstNameNepali || ""}
                onChange={handleChange}
                placeholder={t("vacancy.firstNamePreeti")}
                className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                  errors.firstNameNepali ? "border-red-500" : "border-[#cfdfe6]"
                }`}
              />
              {errors.firstNameNepali && (
                <p className="text-xs text-red-500 mt-1">{errors.firstNameNepali}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.middleNamePreeti")}
              </label>
              <input
                type="text"
                name="middleNameNepali"
                value={localData.middleNameNepali || ""}
                onChange={handleChange}
                placeholder={t("vacancy.middleNamePreeti")}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.lastNamePreeti")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastNameNepali"
                value={localData.lastNameNepali || ""}
                onChange={handleChange}
                placeholder={t("vacancy.lastNamePreeti")}
                className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                  errors.lastNameNepali ? "border-red-500" : "border-[#cfdfe6]"
                }`}
              />
              {errors.lastNameNepali && (
                <p className="text-xs text-red-500 mt-1">{errors.lastNameNepali}</p>
              )}
            </div>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-6 pb-6 border-b border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">Date of Birth</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In BS <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dobBS"
                value={localData.dobBS || ""}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In AD <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dobAD"
                value={localData.dobAD || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={localData.gender || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Citizenship */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Citizenship</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Citizenship Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="citizenshipNumber"
                value={localData.citizenshipNumber || ""}
                onChange={handleChange}
                placeholder="Citizenship number"
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issued District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="issuedDistrict"
                value={localData.issuedDistrict || ""}
                onChange={handleChange}
                placeholder="Issued district"
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issued Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="issuedDate"
                value={localData.issuedDate || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
