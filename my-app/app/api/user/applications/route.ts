import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";
import { getApplicationsByUserId } from "@/services/vacancy-application-service";
import { getVacancyById } from "@/services/vacancy-service";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    // Verify user is logged in
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const session = await verifyUserSession(token);
    if (!session || !session.sub) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    // Get all applications for this user
    const applications = await getApplicationsByUserId(session.sub);

    // Enrich with vacancy title
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const vacancy = await getVacancyById(app.vacancyId);
        return {
          _id: app._id?.toString(),
          vacancyId: app.vacancyId.toString(),
          vacancyTitle: vacancy?.title || "Deleted Job",
          status: app.status,
          createdAt: app.createdAt,
        };
      }),
    );

    return NextResponse.json(enrichedApplications, { status: 200 });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
