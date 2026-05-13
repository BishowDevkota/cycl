import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";
import { getApplicationsByUserId } from "@/services/vacancy-application-service";
import { getVacancyById } from "@/services/vacancy-service";

function parseJsonObject(value: unknown): Record<string, any> {
  if (typeof value !== "string") {
    return {};
  }

  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

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
        const personalDetailsResponse = app.responses.find(
          (response) => response.fieldId === "personalDetails",
        );
        const contactDetailsResponse = app.responses.find(
          (response) => response.fieldId === "contactDetails",
        );
        const photoResponse = app.responses.find((response) => response.fieldId === "photo");

        const personalDetails = parseJsonObject(personalDetailsResponse?.value);
        const contactDetails = parseJsonObject(contactDetailsResponse?.value);

        const fullName = [personalDetails.firstName, personalDetails.lastName]
          .filter((value: unknown) => typeof value === "string" && value.trim().length > 0)
          .join(" ");

        return {
          _id: app._id?.toString(),
          vacancyId: app.vacancyId.toString(),
          vacancyTitle: vacancy?.titleEn || vacancy?.titleNp || "Deleted Job",
          status: app.status,
          createdAt: app.createdAt,
          hasAdmitCardPdf: Boolean(app.pdfCloudinaryPublicId),
          admitCard: {
            fullName: fullName || app.userFullName,
            email: contactDetails.email || app.userEmail,
            phone: contactDetails.mobile || app.userPhone,
            citizenshipNumber: personalDetails.citizenshipNumber || "",
            dobAD: personalDetails.dobAD || "",
            photoUrl: photoResponse?.fileUrl || "",
          },
        };
      }),
    );

    return NextResponse.json({ applications: enrichedApplications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}
