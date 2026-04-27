import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequestCookies } from "@/lib/admin-auth";
import {
  createCompanyStats,
  deleteCompanyStats,
  getAllCompanyStats,
  updateCompanyStats,
  type CompanyStats,
} from "@/services/company-stats-service";

function normalizeField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePayload(payload: Partial<CompanyStats>): Omit<CompanyStats, "_id"> {
  return {
    numberOfBranchOffice: normalizeField(payload.numberOfBranchOffice),
    loanOutstandingNpr: normalizeField(payload.loanOutstandingNpr),
    numberOfCenters: normalizeField(payload.numberOfCenters),
    savingDepositNpr: normalizeField(payload.savingDepositNpr),
    totalStaffIncludingTrainee: normalizeField(payload.totalStaffIncludingTrainee),
    activeClients: normalizeField(payload.activeClients),
  };
}

function hasRequiredFields(data: Omit<CompanyStats, "_id">) {
  return Boolean(
    data.numberOfBranchOffice &&
      data.loanOutstandingNpr &&
      data.numberOfCenters &&
      data.savingDepositNpr &&
      data.totalStaffIncludingTrainee &&
      data.activeClients,
  );
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const allStats = await getAllCompanyStats();
      const stats = allStats.find((item) => item._id?.toString() === id);
      return NextResponse.json(stats || null);
    }

    const allStats = await getAllCompanyStats();
    return NextResponse.json(allStats);
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch company stats" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = (await request.json()) as Partial<CompanyStats>;
    const data = normalizePayload(payload);

    if (!hasRequiredFields(data)) {
      return NextResponse.json(
        { error: "All company stats fields are required" },
        { status: 400 },
      );
    }

    const stats = await createCompanyStats(data);
    return NextResponse.json(stats, { status: 201 });
  } catch (error) {
    console.error("Error creating company stats:", error);
    return NextResponse.json(
      { error: "Failed to create company stats" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter required" }, { status: 400 });
    }

    const payload = (await request.json()) as Partial<CompanyStats>;
    const data = normalizePayload(payload);

    if (!hasRequiredFields(data)) {
      return NextResponse.json(
        { error: "All company stats fields are required" },
        { status: 400 },
      );
    }

    const stats = await updateCompanyStats(id, data);

    if (!stats) {
      return NextResponse.json(
        { error: "Company stats not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error updating company stats:", error);
    return NextResponse.json(
      { error: "Failed to update company stats" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter required" }, { status: 400 });
    }

    const deleted = await deleteCompanyStats(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Company stats not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting company stats:", error);
    return NextResponse.json(
      { error: "Failed to delete company stats" },
      { status: 500 },
    );
  }
}