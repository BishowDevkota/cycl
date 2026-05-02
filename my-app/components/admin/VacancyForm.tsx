"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Vacancy, FormField } from "@/services/vacancy-service";
import FormFieldBuilder from "./FormFieldBuilder";

interface VacancyFormProps {
  initialData?: Vacancy;
  isEditing?: boolean;
}

export default function VacancyForm({
  initialData,
  isEditing = false,
}: VacancyFormProps): React.JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    department: initialData?.department || "",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    experience: initialData?.experience || "",
    applicationDeadline: initialData?.applicationDeadline
      ? new Date(initialData.applicationDeadline).toISOString().split("T")[0]
      : "",
  });

  const [formFields, setFormFields] = useState<FormField[]>(
    initialData?.formFields || [],
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.title || !formData.description || !formData.department || !formData.location) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (formFields.length === 0) {
        setError("Please add at least one form field");
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        formFields,
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline)
          : null,
      };

      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/admin/vacancies/${initialData?._id}`
        : "/api/admin/vacancies";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to save vacancy");
        setLoading(false);
        return;
      }

      router.push("/admin/vacancies");
    } catch (err) {
      setError("An error occurred while saving");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border border-[#d6e6ed] bg-white p-4">
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Senior Developer"
            className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
          />
        </div>

        <div className="border border-[#d6e6ed] bg-white p-4">
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
            Department *
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="e.g., IT"
            className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
          />
        </div>

        <div className="border border-[#d6e6ed] bg-white p-4">
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., New York"
            className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
          />
        </div>

        <div className="border border-[#d6e6ed] bg-white p-4">
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
            Salary (optional)
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="e.g., $50,000 - $70,000"
            className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
          />
        </div>

        <div className="border border-[#d6e6ed] bg-white p-4">
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
            Experience (optional)
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="e.g., 5+ years"
            className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
          />
        </div>

        <div className="border border-[#d6e6ed] bg-white p-4">
          <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
            Application Deadline (optional)
          </label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleInputChange}
            className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
          />
        </div>
      </div>

      <div className="border border-[#d6e6ed] bg-white p-4">
        <label className="mb-1 block text-sm font-semibold uppercase tracking-[0.18em] text-teal-deep">
          Job Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter detailed job description..."
          rows={6}
          className="w-full border border-[#cfdfe6] px-3 py-2 outline-none focus:border-[#0d837f] focus:ring-1 focus:ring-[#0d837f]"
        />
      </div>

      <FormFieldBuilder fields={formFields} onChange={setFormFields} />

      <div className="flex justify-end gap-3 border-t border-[#d6e6ed] pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-[#b9cfd8] bg-white px-6 py-2 text-[#123451] transition hover:bg-[#f3f7f9]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="border border-[#0d837f] bg-[#0d837f] px-6 py-2 text-white transition hover:bg-[#08716e] disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Vacancy"
            : "Create Vacancy"}
        </button>
      </div>
    </form>
  );
}
