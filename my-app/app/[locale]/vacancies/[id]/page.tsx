"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Vacancy } from "@/services/vacancy-service";
import DynamicForm from "@/components/DynamicForm";

interface VacancyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VacancyDetailPage({
  params,
}: VacancyDetailPageProps): React.JSX.Element {
  const router = useRouter();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
        const response = await fetch(`/api/vacancies/${id}`);
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

  const handleSubmitApplication = async (formData: FormData) => {
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch(`/api/vacancies/${id}/apply`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Failed to submit application"
        );
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error && !vacancy) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Job not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Application Submitted!
          </h2>
          <p className="text-green-700 mb-4">
            Thank you for your application. You will receive a confirmation
            email shortly.
          </p>
          <p className="text-gray-600 mb-6">
            The company will review your application and get in touch with you
            very soon.
          </p>

          <Link
            href="/vacancies"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Back to Vacancies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Job Header */}
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-4">
          <Link
            href="/vacancies"
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Vacancies
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-2">{vacancy.title}</h1>
        <p className="text-xl text-gray-600 mb-4">
          {vacancy.department} • {vacancy.location}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {vacancy.salary && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
              {vacancy.salary}
            </span>
          )}
          {vacancy.experience && (
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {vacancy.experience}
            </span>
          )}
          {vacancy.applicationDeadline && (
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-medium">
              Deadline:{" "}
              {new Date(vacancy.applicationDeadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-3">About this role</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {vacancy.description}
        </p>
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Apply for this position</h2>

        {vacancy.formFields && vacancy.formFields.length > 0 ? (
          <DynamicForm
            fields={vacancy.formFields}
            onSubmit={handleSubmitApplication}
            loading={submitting}
          />
        ) : (
          <p className="text-gray-600">
            No application form fields configured for this job.
          </p>
        )}
      </div>
    </div>
  );
}
