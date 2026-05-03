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
    initialData?.formFields || []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || !formData.description || !formData.department || !formData.location) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    if (formFields.length === 0) {
      setError("Please add at least one form field.");
      setLoading(false);
      return;
    }

    try {
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
      setError("An error occurred while saving.");
      console.error(err);
      setLoading(false);
    }
  };

  const inputCls =
    "w-full border-0 border-b border-slate-200 bg-transparent pb-2 pt-1 text-sm text-slate-800 placeholder:text-gray-400 outline-none transition-all focus:border-b-2 focus:border-teal-mid";

  const fieldCard =
    "bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-teal-mid/20";

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 pb-16">

      {/* Error */}
      {error && (
        <div className="border-l-4 border-red-500 bg-red-50 px-5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Header card */}
      <div
        className="w-full overflow-hidden bg-white shadow-sm ring-1 ring-black/5"
        style={{ borderTop: "6px solid #005B5C" }}
      >
        <div className="border-t border-mint px-6 py-5">
          <h1 className="mb-1 text-xl font-semibold text-teal-deep">
            {isEditing ? "Edit Vacancy" : "Create Job Vacancy"}
          </h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to {isEditing ? "update" : "publish"} a job listing.{" "}
            Fields marked <span className="text-red-500">*</span> are required.
          </p>
        </div>
      </div>

      {/* ── Section: Basic Info ── */}
      <div className="w-full bg-white px-6 py-3 shadow-sm ring-1 ring-black/5 border-l-4 border-teal-mid">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-mid">
          Basic Information
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="title" value={formData.title}
            onChange={handleInputChange} placeholder="e.g., Senior Developer"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Department <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="department" value={formData.department}
            onChange={handleInputChange} placeholder="e.g., IT"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="location" value={formData.location}
            onChange={handleInputChange} placeholder="e.g., Kathmandu"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Salary{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text" name="salary" value={formData.salary}
            onChange={handleInputChange} placeholder="e.g., NPR 50,000 – 70,000"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Experience{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text" name="experience" value={formData.experience}
            onChange={handleInputChange} placeholder="e.g., 2+ years"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Application Deadline{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="date" name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleInputChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Section: Description ── */}
      <div className="w-full bg-white px-6 py-3 shadow-sm ring-1 ring-black/5 border-l-4 border-teal-mid">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-mid">
          Job Description
        </p>
      </div>

      <div className={`${fieldCard} w-full`}>
        <label className="mb-3 block text-sm font-medium text-slate-800">
          Full Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description" value={formData.description}
          onChange={handleInputChange}
          placeholder="Describe responsibilities, requirements, and benefits…"
          rows={7}
          className={inputCls + " resize-y"}
        />
      </div>

      {/* ── Section: Form Fields ── */}
      <div className="w-full bg-white px-6 py-3 shadow-sm ring-1 ring-black/5 border-l-4 border-teal-mid">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-mid">
          Application Form Fields
        </p>
      </div>

      <div className="w-full bg-white p-5 shadow-sm ring-1 ring-black/5">
        <FormFieldBuilder fields={formFields} onChange={setFormFields} />
      </div>

      {/* ── Actions ── */}
      <div className="mt-4 flex w-full items-center justify-between border-t border-slate-200 pt-6 pb-8">
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all fields?")) {
              setFormData({
                title: "", description: "", department: "",
                location: "", salary: "", experience: "",
                applicationDeadline: "",
              });
              setFormFields([]);
            }
          }}
          className="border border-teal-mid bg-white px-5 py-2 text-sm font-medium text-teal-mid transition hover:bg-teal-mid/8"
        >
          Clear form
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-teal-mid bg-white px-5 py-2 text-sm font-medium text-teal-mid transition hover:bg-teal-mid/8"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="border border-teal-mid bg-white px-6 py-2 text-sm font-medium text-teal-mid shadow-sm transition hover:bg-teal-mid/8 disabled:opacity-50"
          >
            {loading ? "Saving…" : isEditing ? "Update Vacancy" : "Create Vacancy"}
          </button>
        </div>
      </div>

    </form>
  );
}