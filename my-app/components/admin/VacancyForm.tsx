"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Vacancy, VacancyType } from "@/services/vacancy-service";

type VacancyFormState = {
  titleEn: string;
  titleNp: string;
  descriptionEn: string;
  descriptionNp: string;
  department: string;
  location: string;
  salary: string;
  applicationDeadline: string;
  vacancyType: VacancyType;
  minAge: string;
  maxAge: string;
  minExperienceYears: string;
};

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

  const [formData, setFormData] = useState<VacancyFormState>({
    titleEn: (initialData as any)?.titleEn || "",
    titleNp: (initialData as any)?.titleNp || "",
    descriptionEn: (initialData as any)?.descriptionEn || "",
    descriptionNp: (initialData as any)?.descriptionNp || "",
    department: initialData?.department || "",
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    applicationDeadline: initialData?.applicationDeadline
      ? new Date(initialData.applicationDeadline).toISOString().split("T")[0]
      : "",
    vacancyType: (initialData?.vacancyType || "open_competition") as VacancyType,
    minAge: initialData?.ageRestriction?.minAge?.toString() || "",
    maxAge: initialData?.ageRestriction?.maxAge?.toString() || "",
    minExperienceYears: initialData?.experienceRestriction?.minYears?.toString() || "",
  });

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

    if (
      !formData.titleEn ||
      !formData.titleNp ||
      !formData.descriptionEn ||
      !formData.descriptionNp ||
      !formData.department ||
      !formData.location
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        titleEn: formData.titleEn,
        titleNp: formData.titleNp,
        descriptionEn: formData.descriptionEn,
        descriptionNp: formData.descriptionNp,
        department: formData.department,
        location: formData.location,
        salary: formData.salary || undefined,
        vacancyType: formData.vacancyType,
        applicationDeadline: formData.applicationDeadline
          ? new Date(formData.applicationDeadline)
          : undefined,
        ageRestriction: {
          minAge: formData.minAge ? Number.parseInt(formData.minAge, 10) : undefined,
          maxAge: formData.maxAge ? Number.parseInt(formData.maxAge, 10) : undefined,
        },
        experienceRestriction: {
          minYears: formData.minExperienceYears
            ? Number.parseInt(formData.minExperienceYears, 10)
            : undefined,
        },
        isActive: true,
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
            Job Title (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="titleEn" value={formData.titleEn}
            onChange={handleInputChange} placeholder="e.g., Senior Developer"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Job Title (Nepali) <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="titleNp" value={formData.titleNp}
            onChange={handleInputChange} placeholder="e.g., वरिष्ठ विकासकर्ता"
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
          Full Description (English) <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descriptionEn" value={formData.descriptionEn}
          onChange={handleInputChange}
          placeholder="Describe responsibilities, requirements, and benefits…"
          rows={7}
          className={inputCls + " resize-y"}
        />
      </div>

      <div className={`${fieldCard} w-full`}>
        <label className="mb-3 block text-sm font-medium text-slate-800">
          Full Description (Nepali) <span className="text-red-500">*</span>
        </label>
        <textarea
          name="descriptionNp" value={formData.descriptionNp}
          onChange={handleInputChange}
          placeholder="जिम्मेवारीहरू, आवश्यकताहरू र सुविधाहरू वर्णन गर्नुहोस्…"
          rows={7}
          className={inputCls + " resize-y"}
        />
      </div>

      {/* ── Section: Vacancy Details ── */}
      <div className="w-full bg-white px-6 py-3 shadow-sm ring-1 ring-black/5 border-l-4 border-teal-mid">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-mid">
          Vacancy Details
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Vacancy Type <span className="text-red-500">*</span>
          </label>
          <select
            name="vacancyType"
            value={formData.vacancyType}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                vacancyType: e.target.value as VacancyType,
              }))
            }
            className={inputCls}
          >
            <option value="open_competition">Open Competition</option>
            <option value="internal_competition">Internal Competition</option>
          </select>
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Application Deadline{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleInputChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Section: Eligibility Restrictions ── */}
      <div className="w-full bg-white px-6 py-3 shadow-sm ring-1 ring-black/5 border-l-4 border-teal-mid">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-mid">
          Eligibility Restrictions
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Minimum Age{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            name="minAge"
            value={formData.minAge}
            onChange={handleInputChange}
            placeholder="e.g., 18"
            min="0"
            max="100"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Maximum Age{" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            name="maxAge"
            value={formData.maxAge}
            onChange={handleInputChange}
            placeholder="e.g., 65"
            min="0"
            max="100"
            className={inputCls}
          />
        </div>

        <div className={fieldCard}>
          <label className="mb-3 block text-sm font-medium text-slate-800">
            Minimum Experience (Years){" "}
            <span className="text-xs font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="number"
            name="minExperienceYears"
            value={formData.minExperienceYears}
            onChange={handleInputChange}
            placeholder="e.g., 3"
            min="0"
            max="60"
            className={inputCls}
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="mt-4 flex w-full items-center justify-between border-t border-slate-200 pt-6 pb-8">
        <button
          type="button"
          onClick={() => {
            if (confirm("Clear all fields?")) {
              setFormData({
                titleEn: "",
                titleNp: "",
                descriptionEn: "",
                descriptionNp: "",
                department: "",
                location: "",
                salary: "",
                applicationDeadline: "",
                vacancyType: "open_competition",
                minAge: "",
                maxAge: "",
                minExperienceYears: "",
              } as any);
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