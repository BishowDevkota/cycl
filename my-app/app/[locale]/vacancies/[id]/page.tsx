"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Vacancy } from "@/services/vacancy-service";
import DynamicForm from "@/components/DynamicForm";
import VacancyShell from "@/components/vacancy/VacancyShell";
import { useVacancyLanguage } from "@/components/vacancy/VacancyLanguageContext";

interface VacancyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function VacancyDetailPage({
  params,
}: VacancyDetailPageProps): React.JSX.Element {
  const { t } = useVacancyLanguage();
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
          setError("रिक्ति लोड गर्न सकिएन");
          return;
        }
        const data = await response.json();
        setVacancy(data);
      } catch (err) {
        console.error(err);
        setError("कुनै त्रुटि भयो");
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
          data.error || "आवेदन बुझाउन सकिएन"
        );
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("आवेदन बुझाउने क्रममा त्रुटि भयो");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">पद विवरण लोड हुँदैछ...</p>
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
        <p>पद फेला परेन</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            आवेदन बुझाइयो!
          </h2>
          <p className="text-green-700 mb-4">
            तपाईंको आवेदनका लागि धन्यवाद। चाँडै नै तपाईंले पुष्टि इमेल प्राप्त गर्नुहुनेछ।
          </p>
          <p className="text-gray-600 mb-6">
            संस्थाले तपाईंको आवेदन समीक्षा गरी छिट्टै सम्पर्क गर्नेछ।
          </p>

          <Link
            href="/vacancies"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            रिक्ति सूचीमा फर्किनुहोस्
          </Link>
        </div>
      </div>
    );
  }

  return (
    <VacancyShell>
      <div className="space-y-8">
        {error && (
          <div className="rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-lg border border-[#d6e6ed] bg-white p-8 shadow-sm">
          <div className="mb-4">
            <Link
              href="/vacancies"
              className="text-sm text-blue-600 hover:underline"
            >
              ← {t("vacancy.backToVacancies")}
            </Link>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-[#123451]">{vacancy.title}</h1>
          <p className="mb-4 text-xl text-gray-600">
            {vacancy.department} • {vacancy.location}
          </p>

          <div className="mb-6 flex flex-wrap gap-3">
            {vacancy.salary && (
              <span className="rounded-full bg-green-100 px-4 py-2 font-medium text-green-800">
                {vacancy.salary}
              </span>
            )}
            {vacancy.experience && (
              <span className="rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-800">
                {vacancy.experience}
              </span>
            )}
            {vacancy.applicationDeadline && (
              <span className="rounded-full bg-orange-100 px-4 py-2 font-medium text-orange-800">
                Deadline: {new Date(vacancy.applicationDeadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <h2 className="mb-3 text-xl font-semibold text-[#123451]">{t("vacancy.aboutRole")}</h2>
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
            {vacancy.description}
          </p>
        </div>

        <div className="rounded-lg border border-[#d6e6ed] bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-[#123451]">{t("vacancy.applyPosition")}</h2>

          {vacancy.formFields && vacancy.formFields.length > 0 ? (
            <DynamicForm
              fields={vacancy.formFields}
              onSubmit={handleSubmitApplication}
              loading={submitting}
            />
          ) : (
            <p className="text-gray-600">
              यो पदका लागि कुनै आवेदन फाराम क्षेत्र कन्फिगर गरिएको छैन।
            </p>
          )}
        </div>
      </div>
    </VacancyShell>
  );
}
