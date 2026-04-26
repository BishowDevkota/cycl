import { NextRequest, NextResponse } from "next/server";
import { getAllCompanyStats, getCompanyStats } from "@/lib/company-stats-service";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const allStats = await getAllCompanyStats();
      const stats = allStats.find((item) => item._id?.toString() === id);
      return NextResponse.json(stats || null);
    }

    const stats = await getCompanyStats();
    return NextResponse.json(stats || null);
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch company stats" },
      { status: 500 },
    );
  }
}