"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

interface AdmitCard {
  fullName: string;
  email: string;
  phone: string;
  citizenshipNumber: string;
  dobAD: string;
  photoUrl: string;
}

interface ApplicationItem {
  _id: string;
  vacancyId: string;
  vacancyTitle: string;
  status: "submitted" | "reviewed" | "selected" | "rejected";
  createdAt: string;
  hasAdmitCardPdf: boolean;
  admitCard: AdmitCard;
}

export default function ApplicationDashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const preferredId = searchParams.get("applicationId");
        const response = await fetch("/api/user/applications");

        if (!response.ok) {
          router.push(`/${params.locale}/login`);
          return;
        }

        const data = await response.json();
        const apps: ApplicationItem[] = data.applications || [];
        setApplications(apps);

        if (apps.length > 0) {
          const targetId = preferredId && apps.some((item) => item._id === preferredId)
            ? preferredId
            : apps[0]._id;
          setSelectedId(targetId);
        }
      } catch (loadError) {
        console.error("Error fetching applications:", loadError);
        setError("Failed to load your admit card. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboard();
  }, [params.locale, router, searchParams]);

  const selectedApplication = applications.find((item) => item._id === selectedId) || null;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(`/${params.locale}/`);
    } catch (logoutError) {
      console.error("Logout error:", logoutError);
    }
  };

  const handleDownload = async () => {
    if (!selectedApplication) {
      return;
    }

    setDownloading(true);
    setError("");

    try {
      const response = await fetch(`/api/user/applications/${selectedApplication._id}/admit-card`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Admit card is not ready yet.");
        return;
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `admit-card-${selectedApplication._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (downloadError) {
      console.error("Download error:", downloadError);
      setError("Unable to download admit card right now.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f8f7]">
        <p className="text-lg text-[#0f3f3e]">लोड हुँदैछ...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#d5f3ef_0%,_#eef8f5_40%,_#f9fcfb_100%)] px-6 py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#b9e0da] bg-white p-10 text-center shadow-[0_30px_80px_-45px_rgba(15,118,110,0.55)]">
          <h1 className="text-3xl font-bold text-[#134e4a]">No Applications Found</h1>
          <p className="mt-3 text-[#2f5d58]">
            You have not submitted any vacancy application yet.
          </p>
          <button
            onClick={() => router.push(`/${params.locale}/vacancies`)}
            className="mt-8 rounded-full bg-[#0f766e] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#0b5f58]"
          >
            Browse Vacancies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#e9f8f3_0%,#f7f7ed_45%,#f2f9fb_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 rounded-3xl border border-[#b4ddd6] bg-white/80 p-6 shadow-[0_28px_60px_-40px_rgba(7,89,84,0.7)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#25645d]">Candidate Portal</p>
              <h1 className="mt-2 text-3xl font-black text-[#083b39] md:text-4xl">Admit Card Center</h1>
              <p className="mt-2 text-[#2b5f59]">
                Your application has been submitted. Review your admit card and download the official PDF.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/${params.locale}/vacancies`)}
                className="rounded-full border border-[#0f766e] px-5 py-2 text-sm font-semibold text-[#0f766e] transition hover:bg-[#e6f3f1]"
              >
                Apply Another Job
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full bg-[#0f766e] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0d5f59]"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-3xl border border-[#b4ddd6] bg-white p-5 shadow-[0_20px_50px_-35px_rgba(15,118,110,0.5)]">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#2a6b63]">Submitted Applications</h2>
            <div className="mt-4 space-y-3">
              {applications.map((app) => (
                <button
                  key={app._id}
                  onClick={() => setSelectedId(app._id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedId === app._id
                      ? "border-[#0f766e] bg-[#ecf8f6]"
                      : "border-[#d7ece8] bg-white hover:border-[#97cbc4]"
                  }`}
                >
                  <p className="text-xs text-[#4b726f]">#{app._id.slice(-8).toUpperCase()}</p>
                  <p className="mt-1 text-sm font-semibold text-[#093d3b]">{app.vacancyTitle}</p>
                  <p className="mt-1 text-xs text-[#4b726f]">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-3xl border border-[#8bc7bf] bg-white p-4 shadow-[0_28px_70px_-45px_rgba(12,76,71,0.8)] md:p-8">
            {selectedApplication && (
              <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-[#0f766e]">
                <div className="relative bg-[linear-gradient(120deg,#0f766e_0%,#0e9d92_45%,#14b8a6_100%)] px-6 py-6 text-white md:px-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#d3fffa]">Recruitment Admit Card</p>
                  <h3 className="mt-2 text-3xl font-black">{selectedApplication.vacancyTitle}</h3>
                  <p className="mt-2 text-sm text-[#ddfffb]">
                    Application ID: {selectedApplication._id}
                  </p>

                  <div className="absolute right-6 top-6 h-24 w-20 overflow-hidden rounded-md border-2 border-white bg-[#d6f6f1] md:h-28 md:w-24">
                    {selectedApplication.admitCard.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedApplication.admitCard.photoUrl}
                        alt="Applicant"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-2 text-center text-[10px] font-semibold text-[#0f766e]">
                        PHOTO
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 bg-[#f6fcfb] p-6 md:grid-cols-2 md:gap-4 md:p-8">
                  <div className="rounded-xl border border-[#d6ece8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#407570]">Full Name</p>
                    <p className="mt-2 text-base font-semibold text-[#0e3f3c]">{selectedApplication.admitCard.fullName}</p>
                  </div>
                  <div className="rounded-xl border border-[#d6ece8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#407570]">Email</p>
                    <p className="mt-2 break-all text-base font-semibold text-[#0e3f3c]">{selectedApplication.admitCard.email}</p>
                  </div>
                  <div className="rounded-xl border border-[#d6ece8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#407570]">Phone</p>
                    <p className="mt-2 text-base font-semibold text-[#0e3f3c]">{selectedApplication.admitCard.phone}</p>
                  </div>
                  <div className="rounded-xl border border-[#d6ece8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#407570]">Applied On</p>
                    <p className="mt-2 text-base font-semibold text-[#0e3f3c]">
                      {new Date(selectedApplication.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#d6ece8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#407570]">Citizenship No.</p>
                    <p className="mt-2 text-base font-semibold text-[#0e3f3c]">
                      {selectedApplication.admitCard.citizenshipNumber || "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#d6ece8] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#407570]">Date of Birth (AD)</p>
                    <p className="mt-2 text-base font-semibold text-[#0e3f3c]">
                      {selectedApplication.admitCard.dobAD || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-between gap-4 border-t border-[#c9e7e2] bg-white px-6 py-5 md:flex-row md:items-center md:px-8">
                  <p className="text-sm text-[#3f6863]">
                    Download and keep this admit card for future recruitment process.
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className={`rounded-full px-6 py-3 text-sm font-bold text-white transition ${
                      downloading
                        ? "cursor-not-allowed bg-[#9dbdb8]"
                        : "bg-[#ea580c] hover:bg-[#c74300]"
                    }`}
                  >
                    {downloading ? "Preparing PDF..." : "Download Now"}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
