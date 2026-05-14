import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { USER_SESSION_COOKIE, verifyUserSession } from "@/lib/user-session";
import { getApplicationById, updateApplication } from "@/services/vacancy-application-service";
import { uploadPDFToCloudinary } from "@/lib/cloudinary";
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

    const paymentResponse = application.responses.find(
      (response) => response.fieldId === "paymentData",
    );
    const paymentData = parseJsonObject(paymentResponse?.value);
    const paymentStatus = paymentData?.status || "NOT_PAID";
    const paymentVerified = paymentData?.verified === true || paymentStatus === "COMPLETE";

    if (paymentStatus !== "COMPLETE" || !paymentVerified) {
      return NextResponse.json(
        { error: "Payment is required before downloading the admit card. Your application will not be considered valid until payment is completed." },
        { status: 402 }
      );
    }

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

    console.log(`[Admit Card] Generating PDF for application ${id}`);
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

    console.log(`[Admit Card] PDF generated successfully, size: ${pdfBuffer.length} bytes`);

    if (!application.pdfCloudinaryPublicId) {
      uploadPDFToCloudinary(
        Buffer.from(pdfBuffer),
        `admit-card-${application._id?.toString() || id}.pdf`,
        "application-admit-cards",
      )
        .then((result) => {
          console.log(`[Admit Card] Cloudinary upload successful, public_id: ${result.public_id}`);
          updateApplication(application._id || id, {
            pdfCloudinaryPublicId: result.public_id,
          }).catch((err) => {
            console.error(`[Admit Card] Failed to update application with public_id: ${err}`);
          });
        })
        .catch((err) => {
          console.error(`[Admit Card] Background Cloudinary upload failed: ${err}`);
        });
    }

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="admit-card-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error(`[Admit Card] Error generating admit card:`, error);
    return NextResponse.json(
      { error: "Failed to generate admit card" },
      { status: 500 },
    );
  }
}