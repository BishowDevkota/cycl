"use client";

import { useState, useEffect } from "react";

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
  const [localData, setLocalData] = useState(formData.contactDetails || {});
  const [sameAsPermenant, setSameAsPermenant] = useState(false);

  useEffect(() => {
    setLocalData(formData.contactDetails || {});
  }, [formData.contactDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...localData, [name]: value };
    setLocalData(updated);
    onUpdate("contactDetails", updated);
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
      };
      setLocalData(updated);
      onUpdate("contactDetails", updated);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#123451] mb-6">Contact Detail</h2>

        {/* Permanent Address */}
        <div className="mb-8 pb-8 border-b border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">Permanent Address</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
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
                  District <span className="text-red-500">*</span>
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
                  Local Level Type <span className="text-red-500">*</span>
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
                  Municipality/Rural Municipality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="permMunicipality"
                  value={localData.permMunicipality || ""}
                  onChange={handleChange}
                  placeholder="Municipality"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward No
                </label>
                <input
                  type="text"
                  name="permWard"
                  value={localData.permWard || ""}
                  onChange={handleChange}
                  placeholder="Ward no"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tole
                </label>
                <input
                  type="text"
                  name="permTole"
                  value={localData.permTole || ""}
                  onChange={handleChange}
                  placeholder="Tole"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Name
                </label>
                <input
                  type="text"
                  name="permStreetName"
                  value={localData.permStreetName || ""}
                  onChange={handleChange}
                  placeholder="Street name"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House No
                </label>
                <input
                  type="text"
                  name="permHouseNo"
                  value={localData.permHouseNo || ""}
                  onChange={handleChange}
                  placeholder="House no"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="permPhone"
                  value={localData.permPhone || ""}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
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
              Same as Permanent Address
            </label>
          </div>

          <h3 className="font-semibold text-gray-800 mb-4">Temporary Address</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
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
                  District <span className="text-red-500">*</span>
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
                  Local Level Type <span className="text-red-500">*</span>
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
                  Municipality/Rural Municipality <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="tempMunicipality"
                  value={localData.tempMunicipality || ""}
                  onChange={handleChange}
                  placeholder="Municipality"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward No
                </label>
                <input
                  type="text"
                  name="tempWard"
                  value={localData.tempWard || ""}
                  onChange={handleChange}
                  placeholder="Ward no"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tole
                </label>
                <input
                  type="text"
                  name="tempTole"
                  value={localData.tempTole || ""}
                  onChange={handleChange}
                  placeholder="Tole"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Name
                </label>
                <input
                  type="text"
                  name="tempStreetName"
                  value={localData.tempStreetName || ""}
                  onChange={handleChange}
                  placeholder="Street name"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  House No
                </label>
                <input
                  type="text"
                  name="tempHouseNo"
                  value={localData.tempHouseNo || ""}
                  onChange={handleChange}
                  placeholder="House no"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="tempPhone"
                  value={localData.tempPhone || ""}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-6 border-t border-[#d6e6ed]">
          <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={localData.mobile || ""}
                onChange={handleChange}
                placeholder="Mobile number"
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={localData.email || ""}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full px-3 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
