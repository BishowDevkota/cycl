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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Senior Developer"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Department *
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="e.g., IT"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., New York"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Salary (optional)
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            placeholder="e.g., $50,000 - $70,000"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Experience (optional)
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            placeholder="e.g., 5+ years"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Application Deadline (optional)
          </label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Job Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter detailed job description..."
          rows={6}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <FormFieldBuilder fields={formFields} onChange={setFormFields} />

      <div className="flex gap-3 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
