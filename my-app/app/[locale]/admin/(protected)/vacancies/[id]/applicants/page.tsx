"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FormField } from "@/services/vacancy-service";

interface ApplicantTableRow {
  id: string;
  applicantName: string;
  email: string;
  phone: string;
  status: string;
  appliedAt: string;
  [key: string]: string | number | boolean;
}

interface ApplicantsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ApplicantsPage({
  params,
}: ApplicantsPageProps): React.JSX.Element {
  const [applicants, setApplicants] = useState<ApplicantTableRow[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [vacancyTitle, setVacancyTitle] = useState("");
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

    const fetchApplicants = async () => {
      try {
        const response = await fetch(`/api/admin/vacancies/${id}/applicants`);
        if (!response.ok) {
          setError("Failed to load applicants");
          return;
        }
        const data = await response.json();
        setApplicants(data.applications || []);
        setFormFields(data.formFields || []);
        setVacancyTitle(data.vacancy?.title || "");
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    void fetchApplicants();
  }, [id]);

  const statusColors: { [key: string]: string } = {
    submitted: "bg-blue-100 text-blue-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    selected: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const handleStatusChange = async (
    applicationId: string,
    newStatus: string,
  ) => {
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        alert("Failed to update status");
        return;
      }

      setApplicants(
        applicants.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm("Delete this application?")) return;

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete application");
        return;
      }

      setApplicants(applicants.filter((app) => app.id !== applicationId));
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading applicants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#d6e6ed] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#123451]">Applicants</h1>
          <p className="mt-1 text-slate-600">{vacancyTitle}</p>
        </div>
        <Link
          href="/admin/vacancies"
          className="border border-[#123451] bg-[#123451] px-4 py-2 text-white transition hover:bg-[#0e2b42]"
        >
          ← Back
        </Link>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="border border-[#d6e6ed] bg-white py-12 text-center text-slate-500">
          <p>No applicants yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#d6e6ed] bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#f4fafb] border-b border-[#d6e6ed]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-[#123451]">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-[#123451]">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-[#123451]">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-[#123451]">Applied</th>
                <th className="px-4 py-3 text-left font-semibold text-[#123451]">Status</th>
                {formFields
                  .filter((f) => !["pdf"].includes(f.type))
                  .slice(0, 3)
                  .map((field) => (
                    <th
                      key={field.id}
                      className="px-4 py-3 text-left font-semibold text-[#123451]"
                      title={field.label}
                    >
                      {field.label}
                    </th>
                  ))}
                <th className="px-4 py-3 text-left font-semibold text-[#123451]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((applicant, idx) => (
                <tr
                  key={applicant.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#fbfdfe]"}
                >
                  <td className="px-4 py-3 font-medium text-[#123451]">{applicant.applicantName}</td>
                  <td className="px-4 py-3 text-slate-700">{applicant.email}</td>
                  <td className="px-4 py-3 text-slate-700">{applicant.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {new Date(applicant.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={applicant.status}
                      onChange={(e) =>
                        void handleStatusChange(
                          applicant.id,
                          e.target.value,
                        )
                      }
                      className={`cursor-pointer border px-2 py-1 text-sm font-medium ${
                        statusColors[applicant.status] ||
                        "border-slate-200 bg-slate-50 text-slate-800"
                      }`}
                    >
                      <option value="submitted">Submitted</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  {formFields
                    .filter((f) => !["pdf"].includes(f.type))
                    .slice(0, 3)
                    .map((field) => (
                      <td
                        key={field.id}
                        className="max-w-xs truncate px-4 py-3 text-sm text-slate-700"
                        title={String(
                          applicant[field.label] || "-",
                        )}
                      >
                        {applicant[field.label] ? String(applicant[field.label]).substring(0, 30) : "-"}
                      </td>
                    ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/applications/${applicant.id}`}
                        className="text-sm font-medium text-teal-deep underline decoration-[#f5ad4a] underline-offset-4"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => void handleDelete(applicant.id)}
                        className="text-sm font-medium text-red-600 underline underline-offset-4"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
