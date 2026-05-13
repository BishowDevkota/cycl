import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { USER_SESSION_COOKIE, verifyUserSession } from "@/lib/user-session";
import { getApplicationById, updateApplication } from "@/services/vacancy-application-service";
import { getCloudinaryRawPdfUrl, uploadPDFToCloudinary } from "@/lib/cloudinary";
import { getVacancyById } from "@/services/vacancy-service";
import { generateApplicationAdmitCardPDF } from "@/lib/pdf";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (typeof value !== "string") {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyUserSession(token);
    if (!session?.sub) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.userId.toString() !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Backfill old applications: generate admit card on-demand if missing.
    if (!application.pdfCloudinaryPublicId) {
      const personalDetailsResponse = application.responses.find(
        (response) => response.fieldId === "personalDetails",
      );
      const contactDetailsResponse = application.responses.find(
        (response) => response.fieldId === "contactDetails",
      );
      const photoResponse = application.responses.find(
        (response) => response.fieldId === "photo",
      );

      const personalDetails = parseJsonObject(personalDetailsResponse?.value);
      const contactDetails = parseJsonObject(contactDetailsResponse?.value);
      const vacancy = await getVacancyById(application.vacancyId);

      const firstName = asString(personalDetails.firstName);
      const lastName = asString(personalDetails.lastName);
      const fullName = `${firstName} ${lastName}`.trim() || application.userFullName;

      const pdfBuffer = await generateApplicationAdmitCardPDF({
        applicationId: application._id?.toString() || id,
        fullName,
        email: asString(contactDetails.email) || application.userEmail,
        phone: asString(contactDetails.mobile) || application.userPhone,
        jobTitle: vacancy?.titleEn || vacancy?.titleNp || "Applied Position",
        appliedDate: application.createdAt,
        citizenshipNumber: asString(personalDetails.citizenshipNumber),
        dobAD: asString(personalDetails.dobAD),
        photoUrl: photoResponse?.fileUrl,
      });

      const { public_id } = await uploadPDFToCloudinary(
        pdfBuffer,
        `admit-card-${application._id?.toString() || id}.pdf`,
        "application-admit-cards",
      );

      await updateApplication(application._id || id, {
        pdfCloudinaryPublicId: public_id,
      });

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="admit-card-${id}.pdf"`,
        },
      });
    }

    const pdfUrl = getCloudinaryRawPdfUrl(application.pdfCloudinaryPublicId);
    const pdfResponse = await fetch(pdfUrl);

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch admit card" },
        { status: 502 },
      );
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="admit-card-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error downloading admit card:", error);
    return NextResponse.json(
      { error: "Failed to download admit card" },
      { status: 500 },
    );
  }
}
