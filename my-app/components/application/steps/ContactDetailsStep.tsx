"use client";

import { useState, useEffect } from "react";
import { useVacancyLanguage } from "@/components/vacancy/VacancyLanguageContext";

interface ContactDetailsStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function ContactDetailsStep({
  formData,
  onUpdate,
  vacancyId,
}: ContactDetailsStepProps) {
  const { t } = useVacancyLanguage();
  const [localData, setLocalData] = useState(formData.contactDetails || {});
  const [sameAsPermenant, setSameAsPermenant] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setLocalData(formData.contactDetails || {});
  }, [formData.contactDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...localData, [name]: value };
    setLocalData(updated);
    onUpdate("contactDetails", updated);

    // Validate Nepali address fields
    const nepaliAddressFields = [
      "permMunicipalityNepali",
      "permToleNepali",
      "permStreetNameNepali",
      "tempMunicipalityNepali",
      "tempToleNepali",
      "tempStreetNameNepali",
    ];
    const newErrors = { ...errors };
    if (nepaliAddressFields.includes(name)) {
      if (!value.trim()) {
        newErrors[name] = t("vacancy.required");
      } else {
        delete newErrors[name];
      }
    }
    setErrors(newErrors);
  };

  const handleSameAsPermenant = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setSameAsPermenant(isChecked);

    if (isChecked) {
      const updated = {
        ...localData,
        tempState: localData.permState,
        tempDistrict: localData.permDistrict,
        tempLocalLevelType: localData.permLocalLevelType,
        tempMunicipality: localData.permMunicipality,
        tempWard: localData.permWard,
        tempTole: localData.permTole,
        tempStreetName: localData.permStreetName,
        tempHouseNo: localData.permHouseNo,
        tempPhone: localData.permPhone,
        tempMunicipalityNepali: localData.permMunicipalityNepali,
        tempToleNepali: localData.permToleNepali,
        tempStreetNameNepali: localData.permStreetNameNepali,
      };
      setLocalData(updated);
      onUpdate("contactDetails", updated);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#123451] mb-6">{t("vacancy.contactDetail")}</h2>

        {/* Permanent Address */}
        <div className="mb-8 pb-8 border-b border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">{t("vacancy.permanentAddress")}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.state")} <span className="text-red-500">*</span>
                </label>
                <select
                  name="permState"
                  value={localData.permState || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                >
                  <option value="">Select State</option>
                  <option value="gandaki">Gandaki Pradesh (Province No. 4)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.district")} <span className="text-red-500">*</span>
                </label>
                <select
                  name="permDistrict"
                  value={localData.permDistrict || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                >
                  <option value="">Select District</option>
                  <option value="gorkha">Gorkha</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.localLevelType")} <span className="text-red-500">*</span>
                </label>
                <select
                  name="permLocalLevelType"
                  value={localData.permLocalLevelType || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                >
                  <option value="">Select Type</option>
                  <option value="municipality">Municipality</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.municipality")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="permMunicipality"
                  value={localData.permMunicipality || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.municipality")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.ward")}
                </label>
                <input
                  type="text"
                  name="permWard"
                  value={localData.permWard || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.ward")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.tole")}
                </label>
                <input
                  type="text"
                  name="permTole"
                  value={localData.permTole || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.tole")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.street")}
                </label>
                <input
                  type="text"
                  name="permStreetName"
                  value={localData.permStreetName || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.street")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.houseNo")}
                </label>
                <input
                  type="text"
                  name="permHouseNo"
                  value={localData.permHouseNo || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.houseNo")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.phone")}
                </label>
                <input
                  type="tel"
                  name="permPhone"
                  value={localData.permPhone || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.phone")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>

            {/* Permanent Address in Nepali */}
            <div className="mt-6 pt-6 border-t border-[#d6e6ed]">
              <h4 className="font-semibold mb-2 text-indigo-600">{t("vacancy.permanentAddressNepali")}</h4>
              <p className="text-xs text-indigo-600 mb-3">* {t("vacancy.required")}</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.municipality")} (Preeti) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="permMunicipalityNepali"
                    value={localData.permMunicipalityNepali || ""}
                    onChange={handleChange}
                    placeholder={t("vacancy.municipality")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                      errors.permMunicipalityNepali ? "border-red-500" : "border-[#cfdfe6]"
                    }`}
                  />
                  {errors.permMunicipalityNepali && (
                    <p className="text-xs text-red-500 mt-1">{errors.permMunicipalityNepali}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.tole")} (Preeti) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="permToleNepali"
                    value={localData.permToleNepali || ""}
                    onChange={handleChange}
                    placeholder={t("vacancy.tole")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                      errors.permToleNepali ? "border-red-500" : "border-[#cfdfe6]"
                    }`}
                  />
                  {errors.permToleNepali && (
                    <p className="text-xs text-red-500 mt-1">{errors.permToleNepali}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.street")} (Preeti) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="permStreetNameNepali"
                    value={localData.permStreetNameNepali || ""}
                    onChange={handleChange}
                    placeholder={t("vacancy.street")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                      errors.permStreetNameNepali ? "border-red-500" : "border-[#cfdfe6]"
                    }`}
                  />
                  {errors.permStreetNameNepali && (
                    <p className="text-xs text-red-500 mt-1">{errors.permStreetNameNepali}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Address */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="sameAsPermenant"
              checked={sameAsPermenant}
              onChange={handleSameAsPermenant}
              className="w-4 h-4 rounded border-[#cfdfe6] cursor-pointer"
            />
            <label
              htmlFor="sameAsPermenant"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {t("vacancy.sameAsPermanent")}
            </label>
          </div>

          <h3 className="font-semibold text-gray-800 mb-4">{t("vacancy.temporaryAddress")}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.state")} <span className="text-red-500">*</span>
                </label>
                <select
                  name="tempState"
                  value={localData.tempState || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                >
                  <option value="">Select State</option>
                  <option value="gandaki">Gandaki Pradesh (Province No. 4)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.district")} <span className="text-red-500">*</span>
                </label>
                <select
                  name="tempDistrict"
                  value={localData.tempDistrict || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                >
                  <option value="">Select District</option>
                  <option value="gorkha">Gorkha</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.localLevelType")} <span className="text-red-500">*</span>
                </label>
                <select
                  name="tempLocalLevelType"
                  value={localData.tempLocalLevelType || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                >
                  <option value="">Select Type</option>
                  <option value="municipality">Municipality</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.municipality")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tempMunicipality"
                  value={localData.tempMunicipality || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.municipality")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.ward")}
                </label>
                <input
                  type="text"
                  name="tempWard"
                  value={localData.tempWard || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.ward")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.tole")}
                </label>
                <input
                  type="text"
                  name="tempTole"
                  value={localData.tempTole || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.tole")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.street")}
                </label>
                <input
                  type="text"
                  name="tempStreetName"
                  value={localData.tempStreetName || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.street")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.houseNo")}
                </label>
                <input
                  type="text"
                  name="tempHouseNo"
                  value={localData.tempHouseNo || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.houseNo")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("vacancy.phone")}
                </label>
                <input
                  type="tel"
                  name="tempPhone"
                  value={localData.tempPhone || ""}
                  onChange={handleChange}
                  placeholder={t("vacancy.phone")}
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>

            {/* Temporary Address in Nepali */}
            <div className="mt-6 pt-6 border-t border-[#d6e6ed]">
              <h4 className="font-semibold mb-2 text-indigo-600">{t("vacancy.temporaryAddressNepali")}</h4>
              <p className="text-xs text-indigo-600 mb-3">* {t("vacancy.required")}</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.municipality")} (Preeti) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempMunicipalityNepali"
                    value={localData.tempMunicipalityNepali || ""}
                    onChange={handleChange}
                    placeholder={t("vacancy.municipality")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                      errors.tempMunicipalityNepali ? "border-red-500" : "border-[#cfdfe6]"
                    }`}
                  />
                  {errors.tempMunicipalityNepali && (
                    <p className="text-xs text-red-500 mt-1">{errors.tempMunicipalityNepali}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.tole")} (Preeti) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempToleNepali"
                    value={localData.tempToleNepali || ""}
                    onChange={handleChange}
                    placeholder={t("vacancy.tole")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                      errors.tempToleNepali ? "border-red-500" : "border-[#cfdfe6]"
                    }`}
                  />
                  {errors.tempToleNepali && (
                    <p className="text-xs text-red-500 mt-1">{errors.tempToleNepali}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("vacancy.street")} (Preeti) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tempStreetNameNepali"
                    value={localData.tempStreetNameNepali || ""}
                    onChange={handleChange}
                    placeholder={t("vacancy.street")}
                    className={`w-full px-3 py-2 border rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] ${
                      errors.tempStreetNameNepali ? "border-red-500" : "border-[#cfdfe6]"
                    }`}
                  />
                  {errors.tempStreetNameNepali && (
                    <p className="text-xs text-red-500 mt-1">{errors.tempStreetNameNepali}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-6 border-t border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">{t("vacancy.contactInformation")}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.mobile")} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={localData.mobile || ""}
                onChange={handleChange}
                placeholder={t("vacancy.mobile")}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("vacancy.email")} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={localData.email || ""}
                onChange={handleChange}
                placeholder={t("vacancy.email")}
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
