"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RouteParams {
  params: Promise<{ id: string }>; 
}

export default function ApplicationDetail({ params }: RouteParams) {
  const [application, setApplication] = useState<any | null>(null);
  const [vacancyTitle, setVacancyTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { id } = await params;
        const res = await fetch(`/api/admin/applications/${id}`);
        if (!res.ok) {
          setError("Failed to load application");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setApplication(data.application || null);
        setVacancyTitle(data.vacancyTitleEn || data.vacancyTitleNp || "");
      } catch (err) {
        console.error(err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [params]);

  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-red-700">{error}</div>;
  if (!application) return <div className="p-6">Application not found</div>;

  // Helper to extract a response by fieldId
  const getResponseValue = (fieldId: string) => {
    const r = application.responses?.find((x: any) => x.fieldId === fieldId);
    return r ? r.value : null;
  };

  // Parse JSON-stringified values when necessary
  const parseJson = (val: any) => {
    if (!val) return null;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  };

  const personal = parseJson(getResponseValue("personalDetails")) || {};
  const contact = parseJson(getResponseValue("contactDetails")) || {};
  const education = parseJson(getResponseValue("education")) || [];
  const experience = parseJson(getResponseValue("experience")) || [];
  const submitData = parseJson(getResponseValue("submitData")) || {};

  const photoResp = application.responses?.find((x: any) => x.fieldId === "photo");
  const cvResp = application.responses?.find((x: any) => x.fieldId === "cv");

  const shouldHideKey = (k: string) => {
    if (!k) return false;
    const hide = ["marks", "division", "subjects"];
    return hide.includes(k.toLowerCase());
  };

  const renderValue = (val: any, depth = 0): any => {
    if (val === null || val === undefined || val === "") return <span className="text-slate-500">-</span>;
    if (Array.isArray(val)) {
      return (
        <div className="space-y-2">
          {val.map((it, idx) => (
            <div key={idx} className="pl-2">
              {renderValue(it, depth + 1)}
            </div>
          ))}
        </div>
      );
    }

    if (typeof val === "object") {
      // Render object keys, skipping unwanted ones
      return (
        <div className="grid gap-1">
          {Object.keys(val).map((k) => {
            if (shouldHideKey(k)) return null;
            const v = val[k];
            return (
              <div key={k} className="text-sm">
                <strong>{k}:</strong> {renderValue(v, depth + 1)}
              </div>
            );
          })}
        </div>
      );
    }

    return <span>{String(val)}</span>;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Application Details</h1>
          <p className="text-slate-600">{vacancyTitle}</p>
        </div>
        <Link href="/admin/vacancies" className="text-sm text-slate-700 underline">
          ← Back to vacancies
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded border p-4">
          <h2 className="font-semibold">Personal</h2>
          <div className="mt-2 text-sm space-y-1">
            <div><strong>Name:</strong> {personal.firstName || ""} {personal.lastName || ""}</div>
            <div><strong>Name (Nepali):</strong> {personal.firstNameNepali || ""} {personal.lastNameNepali || ""}</div>
            <div><strong>DOB (AD):</strong> {personal.dobAD || ""}</div>
            <div><strong>DOB (BS):</strong> {personal.dobBS || ""}</div>
            <div><strong>Gender:</strong> {personal.gender || ""}</div>
            <div><strong>Citizenship #:</strong> {personal.citizenshipNumber || ""}</div>
            <div><strong>Issued District:</strong> {personal.issuedDistrict || ""}</div>
            <div><strong>Issued Date:</strong> {personal.issuedDate || ""}</div>
          </div>
        </section>

        <section className="rounded border p-4">
          <h2 className="font-semibold">Contact</h2>
          <div className="mt-2 text-sm space-y-1">
            <div><strong>Mobile:</strong> {contact.mobile || application.userPhone || ""}</div>
            <div><strong>Email:</strong> {contact.email || application.userEmail || ""}</div>
            <div><strong>Permanent:</strong> {contact.permMunicipality || ""}, {contact.permDistrict || ""}</div>
            <div><strong>Temporary:</strong> {contact.tempMunicipality || ""}, {contact.tempDistrict || ""}</div>
          </div>
        </section>
      </div>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Education</h2>
        <div className="mt-2 text-sm space-y-2">
            {Array.isArray(education) && education.length > 0 ? (
            education.map((e: any, i: number) => (
              <div key={i} className="border-b pb-2">
                <div><strong>Degree:</strong> {e.degree || e.degreeNepali || ""}</div>
                <div><strong>Institution:</strong> {e.institution || e.institutionNepali || ""}</div>
                <div><strong>University:</strong> {e.university || e.universityNepali || ""}</div>
                {e.degreeDocument && (e.degreeDocument.fileUrl || e.degreeDocument.publicId) ? (
                  <div className="mt-1">
                    <strong>Document:</strong>{' '}
                    {e.degreeDocument.fileUrl ? (
                      <a href={e.degreeDocument.fileUrl} target="_blank" rel="noreferrer" className="text-teal-700 underline">View</a>
                    ) : (
                      <span>Uploaded</span>
                    )}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No education details provided</div>
          )}
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Experience</h2>
        <div className="mt-2 text-sm space-y-2">
          {Array.isArray(experience) && experience.length > 0 ? (
            experience.map((ex: any, i: number) => (
              <div key={i} className="border-b pb-2">
                <div><strong>Organization:</strong> {ex.organization || ex.organizationNepali || ""}</div>
                <div><strong>Position:</strong> {ex.position || ex.positionNepali || ""}</div>
                <div><strong>Period:</strong> {ex.serviceFrom || ""} — {ex.serviceTo || ""}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-600">No experience provided</div>
          )}
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Submission</h2>
        <div className="mt-2 text-sm space-y-1">
          <div><strong>Applied At:</strong> {new Date(application.createdAt).toLocaleString()}</div>
          <div><strong>Application Type:</strong> {submitData.primaryApplicationType || ""}</div>
          <div><strong>Confirmation Checked:</strong> {submitData.confirmationChecked ? "Yes" : "No"}</div>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">Files</h2>
        <div className="mt-2 text-sm space-y-1">
          {photoResp ? (
            <div>
              <strong>Photo:</strong>{' '}
              {photoResp.fileUrl ? (
                <a href={photoResp.fileUrl} target="_blank" rel="noreferrer" className="text-teal-700 underline">View</a>
              ) : (
                <span>Uploaded</span>
              )}
            </div>
          ) : null}

          {cvResp ? (
            <div>
              <strong>CV:</strong>{' '}
              {cvResp.fileUrl ? (
                <a href={cvResp.fileUrl} target="_blank" rel="noreferrer" className="text-teal-700 underline">View</a>
              ) : (
                <span>Uploaded</span>
              )}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="font-semibold">All Responses</h2>
        <div className="mt-2 text-sm space-y-3">
          {Array.isArray(application.responses) && application.responses.length > 0 ? (
            application.responses.map((resp: any, i: number) => {
              const { fieldLabel, fieldType, value, fileUrl } = resp;

              // Try to parse JSON values for display
              let parsed: any = null;
              if (typeof value === "string") {
                try {
                  parsed = JSON.parse(value);
                } catch (e) {
                  parsed = null;
                }
              }

              return (
                <div key={i} className="rounded border p-3">
                  <div className="mb-2 font-medium">{fieldLabel} <span className="text-xs text-slate-500">({fieldType})</span></div>

                  {fieldType === "pdf" && (fileUrl || value) ? (
                    <div>
                      {fileUrl ? (
                        <a href={fileUrl} target="_blank" rel="noreferrer" className="text-teal-700 underline">Open document</a>
                      ) : (
                        <span className="text-slate-600">Uploaded (ID: {String(value)})</span>
                      )}
                    </div>
                      ) : parsed !== null ? (
                        <div className="grid gap-2">
                          {renderValue(parsed)}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-700">{String(value ?? "-")}</div>
                      )}
                </div>
              );
            })
          ) : (
            <div className="text-sm text-slate-600">No responses recorded</div>
          )}
        </div>
      </section>
    </div>
  );
}
