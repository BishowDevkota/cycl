"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface SubmitStepProps {
  formData: any;
  onUpdate: (section: string, data: any) => void;
  vacancyId: string;
}

export default function SubmitStep({
  formData,
  onUpdate,
  vacancyId,
}: SubmitStepProps) {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitData, setSubmitData] = useState({
    primaryApplicationType: "",
    additionalApplicationTypes: "",
    confirmationChecked: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setSubmitData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setSubmitData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveAndContinue = () => {
    onUpdate("submitData", submitData);
  };

  const handleSubmit = async () => {
    const docs = formData.documents || {};
    const hasPhoto = docs.photo instanceof File;
    const hasCv = docs.cv instanceof File;

    if (!hasPhoto || !hasCv) {
      setError(
        "Your documents (photo and CV) were not persisted after payment. Please go back to the Documents step and re-upload them, then return here to submit."
      );
      return;
    }

    if (!submitData.primaryApplicationType) {
      setError("Please select a primary application type");
      return;
    }

    if (!submitData.confirmationChecked) {
      setError(
        "Please confirm that you have read all instructions and completed required documents"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = new FormData();

      payload.append("personalDetails", JSON.stringify(formData.personalDetails || {}));
      payload.append("contactDetails", JSON.stringify(formData.contactDetails || {}));
      payload.append("education", JSON.stringify(formData.education || []));
      payload.append("experience", JSON.stringify(formData.experience || []));
      payload.append("submitData", JSON.stringify(submitData || {}));

      const paymentData = {
        verified: false,
        status: "NOT_PAID",
        amount: 0,
        verifiedAt: new Date().toISOString(),
      };
      payload.append("paymentData", JSON.stringify(paymentData));

      if (docs.photo instanceof File) {
        payload.append("photo", docs.photo);
      }
      if (docs.cv instanceof File) {
        payload.append("cv", docs.cv);
      }

      const response = await fetch(`/api/vacancies/${vacancyId}/apply`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to submit application");
        setLoading(false);
        return;
      }

      const submittedId = data.applicationId;
      router.push(`/${params.locale}/dashboard/applications?applicationId=${submittedId}`);
    } catch (err) {
      console.error("Submit error:", err);
      setError("An error occurred while submitting");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
        <p className="font-bold mb-1">Important Notice:</p>
        <p>Your application will be saved with payment status "NOT PAID". To appear in the interview and have your application considered valid, you must complete the payment. The admit card will only be available after payment.</p>
      </div>

      <div>
        <p className="text-lg font-semibold text-blue-600 mb-6">
          Input following information to Apply for the Job
        </p>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Select First Application Type <span className="text-red-500">*</span>
            </label>
            <select
              name="primaryApplicationType"
              value={submitData.primaryApplicationType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] bg-white"
            >
              <option value="">-- Select --</option>
              <option value="open">Open Competition</option>
              <option value="internal">Internal Competition</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Select Additional Job Application Types (Optional)
            </label>
            <select
              name="additionalApplicationTypes"
              value={submitData.additionalApplicationTypes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#cfdfe6] rounded outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f] bg-white"
            >
              <option value="">-- Select --</option>
              <option value="open">Open Competition</option>
              <option value="internal">Internal Competition</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="confirmationChecked"
              checked={submitData.confirmationChecked}
              onChange={handleChange}
              className="w-5 h-5 rounded border-[#cfdfe6] cursor-pointer accent-[#0d837f]"
            />
            <span className="text-sm font-semibold text-gray-800">
              I have carefully read all instructions, completed all required
              documents and applied for the Job.
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-[#d6e6ed]">
        <button
          onClick={handleSaveAndContinue}
          className="px-6 py-2 border border-[#cfdfe6] text-gray-700 rounded font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded font-medium transition ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-[#f5ad4a] text-white hover:bg-[#e8990d]"
          }`}
        >
          {loading ? "Submitting..." : "Submit Application (Payment Pending)"}
        </button>
      </div>
    </div>
  );
}