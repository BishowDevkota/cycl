"use client";

import { useEffect, useState } from "react";
import type { CompanyStats } from "@/lib/company-stats-service";

const STATS_FIELDS: Array<{
  key: keyof Omit<CompanyStats, "_id" | "createdAt" | "updatedAt">;
  label: string;
}> = [
  { key: "numberOfBranchOffice", label: "Number of Branch Office" },
  { key: "loanOutstandingNpr", label: "Loan Outstanding (NPR)" },
  { key: "numberOfCenters", label: "Number of Centers" },
  { key: "savingDepositNpr", label: "Saving & Deposit (NPR)" },
  { key: "totalStaffIncludingTrainee", label: "Total Staff (Including Trainee)" },
  { key: "activeClients", label: "Number of Active Clients" },
];

export function CompanyStatsSection() {
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/home/company-stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch company stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return null;
  }

  return (
    <section className="mt-14 w-full border-y border-zinc-200 bg-zinc-50 py-12 sm:py-14 lg:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Snapshot
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-zinc-900 sm:text-4xl">
            Company Highlights
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {STATS_FIELDS.map((field) => (
            <div
              key={field.key}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300"
            >
              <p className="text-3xl font-bold leading-none text-zinc-900 sm:text-4xl">
                {stats[field.key] || "-"}
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-zinc-600">
                {field.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}