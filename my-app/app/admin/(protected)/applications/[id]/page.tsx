"use client";

import { useState, useEffect } from "react";
import { VacancyApplication } from "@/services/vacancy-application-service";

interface ApplicationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps): React.JSX.Element {
  const [application, setApplication] = useState<VacancyApplication | null>(null);
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const unwrapParams = async () => {
      const { id: appId } = await params;
      setId(appId);
    };
    void unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/admin/applications/${id}`);
        if (!response.ok) {
          setError("Failed to load application");
          return;
        }
        const data = await response.json();
        setApplication(data.application);
        setVacancyTitle(data.vacancyTitle);
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    void fetchApplication();
  }, [id]);

  const statusColors: { [key: string]: string } = {
    submitted: "bg-blue-100 text-blue-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    selected: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;

    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        alert("Failed to update status");
        return;
      }

      setApplication({ ...application, status: newStatus as any });
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this application?")) return;

    try {
      const response = await fetch(`/api/admin/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete application");
        return;
      }

      window.history.back();
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading application...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  if (!application) {
    return <div className="text-center py-8">Application not found</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Application Detail</h1>
          <p className="text-gray-600">{vacancyTitle}</p>
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-start pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold">{application.userFullName}</h2>
            <p className="text-gray-600">{application.userEmail}</p>
            <p className="text-gray-600">{application.userPhone}</p>
          </div>
          <div className="text-right">
            <div className="mb-3">
              <span
                className={`inline-block px-3 py-1 rounded font-medium ${
                  statusColors[application.status] ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {application.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Applied: {new Date(application.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-3">Responses</h3>
            <div className="space-y-3">
              {application.responses.map((response, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-3 rounded border"
                >
                  <p className="text-sm text-gray-600 font-medium">
                    {response.fieldLabel}
                  </p>
                  {response.fieldType === "pdf" ? (
                    response.fileUrl ? (
                      <a
                        href={response.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                      >
                        📄 View PDF
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">PDF unavailable</p>
                    )
                  ) : (
                    <p className="mt-1 text-gray-800">
                      {Array.isArray(response.value)
                        ? response.value.join(", ")
                        : String(response.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Update Status</label>
            <select
              value={application.status}
              onChange={(e) => void handleStatusChange(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={handleDelete}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
