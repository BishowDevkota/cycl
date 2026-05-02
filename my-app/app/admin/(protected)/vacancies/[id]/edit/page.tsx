"use client";

import { useState, useEffect } from "react";
import { Vacancy } from "@/services/vacancy-service";
import VacancyForm from "@/components/admin/VacancyForm";

interface EditVacancyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditVacancyPage({
  params,
}: EditVacancyPageProps): React.JSX.Element {
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const unwrapParams = async () => {
      const { id: vacancyId } = await params;
      setId(vacancyId);
    };
    void unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchVacancy = async () => {
      try {
        const response = await fetch(`/api/admin/vacancies/${id}`);
        if (!response.ok) {
          setError("Failed to load vacancy");
          return;
        }
        const data = await response.json();
        setVacancy(data);
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    void fetchVacancy();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading vacancy...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  if (!vacancy) {
    return <div className="text-center py-8">Vacancy not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Vacancy</h1>
        <p className="text-gray-600">
          Update job details and application form fields.
        </p>
      </div>

      <VacancyForm initialData={vacancy} isEditing />
    </div>
  );
}
