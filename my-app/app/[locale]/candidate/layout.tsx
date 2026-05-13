"use client";

import CandidateSidebar from "@/components/candidate/CandidateSidebar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex">
      <CandidateSidebar />
      <div className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}
