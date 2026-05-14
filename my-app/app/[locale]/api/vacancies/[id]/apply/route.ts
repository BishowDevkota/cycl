import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";
import { getUserById } from "@/services/user-service";
import { getVacancyById } from "@/services/vacancy-service";
import {
  createApplication,
  getUserApplicationForVacancy,
  ApplicationResponse,
  updateApplication,
} from "@/services/vacancy-application-service";
import { generateApplicationAdmitCardPDF } from "@/lib/pdf";
import { uploadPDFToCloudinary, uploadApplicationFileToCloudinary } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in to apply" },
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

    const user = await getUserById(session.sub);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const { id: vacancyId } = await params;

    if (!ObjectId.isValid(vacancyId)) {
      return NextResponse.json(
        { error: "Invalid vacancy ID" },
        { status: 400 },
      );
    }

    const existingApplication = await getUserApplicationForVacancy(
      user._id!,
      vacancyId,
    );
    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 409 },
      );
    }

    const vacancy = await getVacancyById(vacancyId);
    if (!vacancy) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 },
      );
    }

    if (!vacancy.isActive) {
      return NextResponse.json(
        { error: "This vacancy is no longer available" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const responses: ApplicationResponse[] = [];

    const applicantPersonal = JSON.parse(formData.get("personalDetails")?.toString() || "{}");

    if (vacancy.ageRestriction?.minAge || vacancy.ageRestriction?.maxAge) {
      const dobAD = applicantPersonal.dobAD;
      if (dobAD) {
        const birthDate = new Date(dobAD);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (vacancy.ageRestriction.minAge && age < vacancy.ageRestriction.minAge) {
          return NextResponse.json(
            { error: `You must be at least ${vacancy.ageRestriction.minAge} years old to apply for this position` },
            { status: 400 },
          );
        }

        if (vacancy.ageRestriction.maxAge && age > vacancy.ageRestriction.maxAge) {
          return NextResponse.json(
            { error: `You must be no older than ${vacancy.ageRestriction.maxAge} years old to apply for this position` },
            { status: 400 },
          );
        }
      }
    }

    if (vacancy.experienceRestriction?.minYears) {
      const experience = JSON.parse(formData.get("experience")?.toString() || "[]");
      let totalYears = 0;

      for (const exp of experience) {
        if (exp.serviceFrom && exp.serviceTo) {
          const fromDate = new Date(exp.serviceFrom);
          const toDate = new Date(exp.serviceTo);
          const yearsInJob = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          totalYears += yearsInJob;
        }
      }

      if (totalYears < vacancy.experienceRestriction.minYears) {
        return NextResponse.json(
          { error: `You must have at least ${vacancy.experienceRestriction.minYears} years of experience to apply for this position` },
          { status: 400 },
        );
      }
    }

    if (formData.has("personalDetails") || formData.has("submitData")) {
      try {
        const structuredPersonal = JSON.parse(formData.get("personalDetails")?.toString() || "{}");
        const contact = JSON.parse(formData.get("contactDetails")?.toString() || "{}");
        const education = JSON.parse(formData.get("education")?.toString() || "[]");
        const experience = JSON.parse(formData.get("experience")?.toString() || "[]");
        const submit = JSON.parse(formData.get("submitData")?.toString() || "{}");
        const payment = JSON.parse(formData.get("paymentData")?.toString() || "{}");

        const paymentStatus = payment?.status || "NOT_PAID";
        const paymentVerified = paymentStatus === "COMPLETE" && payment?.verified === true;

        responses.push({
          fieldId: "personalDetails",
          fieldLabel: "Personal Details",
          fieldType: "text",
          value: JSON.stringify(structuredPersonal),
        });

        responses.push({
          fieldId: "contactDetails",
          fieldLabel: "Contact Details",
          fieldType: "text",
          value: JSON.stringify(contact),
        });

        responses.push({
          fieldId: "education",
          fieldLabel: "Education",
          fieldType: "text",
          value: JSON.stringify(education),
        });

        responses.push({
          fieldId: "experience",
          fieldLabel: "Experience",
          fieldType: "text",
          value: JSON.stringify(experience),
        });

        responses.push({
          fieldId: "submitData",
          fieldLabel: "Submit Data",
          fieldType: "text",
          value: JSON.stringify(submit),
        });

        responses.push({
          fieldId: "paymentData",
          fieldLabel: "Payment Data",
          fieldType: "text",
          value: JSON.stringify({ ...payment, status: paymentStatus, verified: paymentVerified }),
        });

        const photo = formData.get("photo") as File | null;
        if (photo && photo.size > 0) {
          const buffer = await photo.arrayBuffer();
          const { public_id, secure_url } = await uploadApplicationFileToCloudinary(
            Buffer.from(buffer),
            photo.name,
            "image",
            vacancyId,
          );

          responses.push({
            fieldId: "photo",
            fieldLabel: "Photo",
            fieldType: "pdf",
            value: public_id,
            fileUrl: secure_url,
          });
        }

        const cv = formData.get("cv") as File | null;
        if (cv && cv.size > 0) {
          const buffer = await cv.arrayBuffer();
          const { public_id, secure_url } = await uploadApplicationFileToCloudinary(
            Buffer.from(buffer),
            cv.name,
            "pdf",
            vacancyId,
          );

          responses.push({
            fieldId: "cv",
            fieldLabel: "CV",
            fieldType: "pdf",
            value: public_id,
            fileUrl: secure_url,
          });
        }
      } catch (err) {
        console.error("Failed to parse structured application form data:", err);
        return NextResponse.json({ error: "Invalid application data" }, { status: 400 });
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported application format. Please use the standard application form." },
        { status: 400 },
      );
    }

    const application = await createApplication({
      vacancyId: new ObjectId(vacancyId),
      userId: user._id!,
      userEmail: user.email,
      userFullName: user.fullName,
      userPhone: user.phone,
      responses,
      status: "submitted",
    });

    const getResponseValue = (fieldId: string): string | undefined => {
      const response = responses.find((item) => item.fieldId === fieldId);
      if (!response || typeof response.value !== "string") {
        return undefined;
      }

      return response.value;
    };

    const parseJsonObject = (value?: string): Record<string, any> => {
      if (!value) {
        return {};
      }

      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    };

    const personalDetails = parseJsonObject(getResponseValue("personalDetails"));
    const contactDetails = parseJsonObject(getResponseValue("contactDetails"));
    const photoResponse = responses.find((item) => item.fieldId === "photo");

    const candidateName = [personalDetails.firstName, personalDetails.lastName]
      .filter((value: unknown) => typeof value === "string" && value.trim().length > 0)
      .join(" ");

    const pdfBuffer = await generateApplicationAdmitCardPDF({
      applicationId: application._id?.toString() || "",
      fullName: candidateName || user.fullName,
      email: contactDetails.email || user.email,
      phone: contactDetails.mobile || user.phone,
      jobTitle: vacancy.titleEn || vacancy.titleNp || "",
      appliedDate: application.createdAt,
      citizenshipNumber: personalDetails.citizenshipNumber,
      dobAD: personalDetails.dobAD,
      photoUrl: photoResponse?.fileUrl,
    });

    const { public_id } = await uploadPDFToCloudinary(
      pdfBuffer,
      `admit-card-${application._id?.toString()}.pdf`,
      "application-admit-cards",
    );

    await updateApplication(
      application._id!,
      { pdfCloudinaryPublicId: public_id },
    );

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        applicationId: application._id?.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}