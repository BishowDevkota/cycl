import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import { getVacancyById } from "@/services/vacancy-service";
import { getApplicationsByVacancyId } from "@/services/vacancy-application-service";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    // Verify admin is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const session = await verifyAdminSession(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    const { id: vacancyId } = await params;

    if (!ObjectId.isValid(vacancyId)) {
      return NextResponse.json(
        { error: "Invalid vacancy ID" },
        { status: 400 },
      );
    }

    // Get vacancy to verify admin owns it
    const vacancy = await getVacancyById(vacancyId);
    if (!vacancy) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 },
      );
    }

    if (vacancy.createdBy.toString() !== session.sub) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    // Get all applications for this vacancy
    const applications = await getApplicationsByVacancyId(vacancyId);

    // Format data for tabular view
    const tableData = applications.map((app) => {
      const row: { [key: string]: string | boolean | number | Date | string[] } = {
        id: app._id?.toString() || "",
        applicantName: app.userFullName,
        email: app.userEmail,
        phone: app.userPhone,
        status: app.status,
        appliedAt: app.createdAt,
      };

      // Add all form field responses as columns
      for (const response of app.responses) {
        row[response.fieldLabel] = response.value;
      }

      return row;
    });

    return NextResponse.json(
      {
        vacancyId,
        vacancy: {
          title: vacancy.title,
          description: vacancy.description,
        },
        totalApplications: applications.length,
        formFields: vacancy.formFields,
        applications: tableData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 },
    );
  }
}
