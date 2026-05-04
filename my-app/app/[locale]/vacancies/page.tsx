"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicPageShell } from "@/components/public/PublicPageShell";

type CompetitionTab = "open" | "internal";

interface VacancyRow {
  id: string;
  advertisementNo: string;
  position: string;
  publishedDateBS: string;
  publishedDateAD: string;
  deadlineBS: string;
  deadlineAD: string;
  doubleFeeDeadlineBS: string;
  doubleFeeDeadlineAD: string;
  type: string;
  inclusive: string;
  numberOfPosts: number;
  competitionType: CompetitionTab;
}

const VACANCIES: VacancyRow[] = [
  {
    id: "1",
    advertisementNo: "01/2082/083",
    position: "Assistant/Deputy Manager (Finance Department Head)",
    publishedDateBS: "2083-01-14",
    publishedDateAD: "27/04/2026",
    deadlineBS: "2083-01-28",
    deadlineAD: "11/05/2026",
    doubleFeeDeadlineBS: "2083-01-28",
    doubleFeeDeadlineAD: "11/05/2026",
    type: "Open",
    inclusive: "Open",
    numberOfPosts: 1,
    competitionType: "open",
  },
  {
    id: "2",
    advertisementNo: "02/2082/083",
    position: "Assistant Manager (Migration and Supervision Department Head)",
    publishedDateBS: "2083-01-14",
    publishedDateAD: "27/04/2026",
    deadlineBS: "2083-01-28",
    deadlineAD: "11/05/2026",
    doubleFeeDeadlineBS: "2083-01-28",
    doubleFeeDeadlineAD: "11/05/2026",
    type: "Open",
    inclusive: "Open",
    numberOfPosts: 1,
    competitionType: "open",
  },
  {
    id: "3",
    advertisementNo: "03/2082/083",
    position: "Assistant Manager (Planning and Research Department Head)",
    publishedDateBS: "2083-01-14",
    publishedDateAD: "27/04/2026",
    deadlineBS: "2083-01-28",
    deadlineAD: "11/05/2026",
    doubleFeeDeadlineBS: "2083-01-28",
    doubleFeeDeadlineAD: "11/05/2026",
    type: "Open",
    inclusive: "Open",
    numberOfPosts: 1,
    competitionType: "open",
  },
  {
    id: "4",
    advertisementNo: "04/2082/083",
    position: "Senior Officer (Department/Province/Cluster)",
    publishedDateBS: "2083-01-13",
    publishedDateAD: "26/04/2026",
    deadlineBS: "2083-01-27",
    deadlineAD: "10/05/2026",
    doubleFeeDeadlineBS: "2083-01-27",
    doubleFeeDeadlineAD: "10/05/2026",
    type: "Open",
    inclusive: "Open",
    numberOfPosts: 2,
    competitionType: "open",
  },
  {
    id: "5",
    advertisementNo: "05/2082/083",
    position: "Officer (Province/Cluster/Branch Head)",
    publishedDateBS: "2083-01-14",
    publishedDateAD: "27/04/2026",
    deadlineBS: "2083-01-28",
    deadlineAD: "11/05/2026",
    doubleFeeDeadlineBS: "2083-01-28",
    doubleFeeDeadlineAD: "11/05/2026",
    type: "Open",
    inclusive: "Open",
    numberOfPosts: 5,
    competitionType: "open",
  },
  {
    id: "6",
    advertisementNo: "06/2082/083",
    position: "Junior Officer (Branch Head)",
    publishedDateBS: "2083-01-14",
    publishedDateAD: "27/04/2026",
    deadlineBS: "2083-01-28",
    deadlineAD: "11/05/2026",
    doubleFeeDeadlineBS: "2083-01-28",
    doubleFeeDeadlineAD: "11/05/2026",
    type: "Open",
    inclusive: "Open",
    numberOfPosts: 10,
    competitionType: "open",
  },
];

function DateCell({ bs, ad }: { bs: string; ad: string }) {
  return (
    <span className="whitespace-nowrap text-slate-600">
      {bs}
      <br />
      <span className="text-slate-400 text-xs">({ad})</span>
    </span>
  );
}

export default function VacanciesPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<CompetitionTab>("open");
  const [filterAdNo, setFilterAdNo] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [filterPublished, setFilterPublished] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("");
  const [filterDoubleFee, setFilterDoubleFee] = useState("");
  const [filterType, setFilterType] = useState("");

  const tabVacancies = VACANCIES.filter((v) => v.competitionType === activeTab);

  const filtered = tabVacancies.filter(
    (v) =>
      v.advertisementNo.toLowerCase().includes(filterAdNo.toLowerCase()) &&
      v.position.toLowerCase().includes(filterPosition.toLowerCase()) &&
      (v.publishedDateBS + v.publishedDateAD)
        .toLowerCase()
        .includes(filterPublished.toLowerCase()) &&
      (v.deadlineBS + v.deadlineAD)
        .toLowerCase()
        .includes(filterDeadline.toLowerCase()) &&
      (v.doubleFeeDeadlineBS + v.doubleFeeDeadlineAD)
        .toLowerCase()
        .includes(filterDoubleFee.toLowerCase()) &&
      v.type.toLowerCase().includes(filterType.toLowerCase())
  );

  return (
    <PublicPageShell
      imageUrl="/banner/banner.jpg"
      eyebrow="Careers"
      title="Open Positions"
      description="Browse current openings and find the role that matches your skills and experience."
    >
      <section className="bg-white p-6 sm:p-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#123451]">Vacancy Listings</h1>
          <p className="text-slate-500">Manage and review all published job openings</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d6e6ed]">
          {(["open", "internal"] as CompetitionTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-[#0d837f] bg-white text-[#0d837f]"
                  : "bg-[#f5f0e8] text-slate-600 hover:text-[#0d837f]"
              }`}
            >
              {tab === "open" ? "Open Competition" : "Internal Competition"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#d6e6ed] bg-white text-left">
                <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Advertisement No.</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Position</th>
                <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Published Date</th>
                <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Deadline</th>
                <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Double Fee Deadline</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Type</th>
                <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">Open / Inclusive</th>
                <th className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">No. of Posts</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Action</th>
              </tr>

              {/* Per-column filter row */}
              <tr className="border-b border-[#d6e6ed] bg-[#fafafa]">
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filter..." value={filterAdNo} onChange={(e) => setFilterAdNo(e.target.value)} className="w-full border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" />
                </td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filter..." value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)} className="w-full border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" />
                </td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filter..." value={filterPublished} onChange={(e) => setFilterPublished(e.target.value)} className="w-full border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" />
                </td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filter..." value={filterDeadline} onChange={(e) => setFilterDeadline(e.target.value)} className="w-full border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" />
                </td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filter..." value={filterDoubleFee} onChange={(e) => setFilterDoubleFee(e.target.value)} className="w-full border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" />
                </td>
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filt..." value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-20 border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" />
                </td>
                <td className="px-3 py-2" />
                <td className="px-3 py-2">
                  <input type="text" placeholder="Filter..." className="w-full border border-[#cfdfe6] px-2 py-1 text-xs outline-none focus:border-[#0d837f]" readOnly />
                </td>
                <td className="px-3 py-2" />
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-slate-500">
                    No vacancies found.
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="border-b border-[#eef4f7] transition hover:bg-[#f9fcfe]">
                    <td className="px-4 py-4 text-slate-700 whitespace-nowrap">{v.advertisementNo}</td>
                    <td className="px-4 py-4 font-medium text-[#123451]">{v.position}</td>
                    <td className="px-4 py-4">
                      <DateCell bs={v.publishedDateBS} ad={v.publishedDateAD} />
                    </td>
                    <td className="px-4 py-4">
                      <DateCell bs={v.deadlineBS} ad={v.deadlineAD} />
                    </td>
                    <td className="px-4 py-4">
                      <DateCell bs={v.doubleFeeDeadlineBS} ad={v.doubleFeeDeadlineAD} />
                    </td>
                    <td className="px-4 py-4 text-slate-600">{v.type}</td>
                    <td className="px-4 py-4 text-slate-600">{v.inclusive}</td>
                    <td className="px-4 py-4 text-center font-medium text-slate-700">{v.numberOfPosts}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/vacancies/${v.id}/apply`}
                          className="inline-flex items-center justify-center bg-[#0d837f] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#08716e] whitespace-nowrap"
                        >
                          Login to Apply
                        </Link>
                        <Link
                          href={`/vacancies/${v.id}`}
                          className="inline-flex items-center justify-center bg-[#0a6b68] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#085856] whitespace-nowrap"
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </PublicPageShell>
  );
}