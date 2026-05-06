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
} from "@/services/vacancy-application-service";
import { generateApplicationThankYouPDF } from "@/lib/pdf";
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
    // Verify user is logged in
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

    // Validate vacancy ID
    if (!ObjectId.isValid(vacancyId)) {
      return NextResponse.json(
        { error: "Invalid vacancy ID" },
        { status: 400 },
      );
    }

    // Check if user already applied
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

    // Get vacancy
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

    // Get form data
    const formData = await request.formData();
    const responses: ApplicationResponse[] = [];
    const uploadedFiles: { publicId: string; fieldId: string }[] = [];

    // If the client sent our structured application payload (JSON parts + files), handle that first
    if (formData.has("personalDetails") || formData.has("submitData")) {
      try {
        const personal = JSON.parse(formData.get("personalDetails")?.toString() || "{}");
        const contact = JSON.parse(formData.get("contactDetails")?.toString() || "{}");
        const education = JSON.parse(formData.get("education")?.toString() || "[]");
        const experience = JSON.parse(formData.get("experience")?.toString() || "[]");
        const submit = JSON.parse(formData.get("submitData")?.toString() || "{}");

        responses.push({
          fieldId: "personalDetails",
          fieldLabel: "Personal Details",
          fieldType: "text",
          value: JSON.stringify(personal),
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

        // Handle files (photo, cv) if present
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

          uploadedFiles.push({ publicId: public_id, fieldId: "photo" });
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

          uploadedFiles.push({ publicId: public_id, fieldId: "cv" });
        }
      } catch (err) {
        console.error("Failed to parse structured application form data:", err);
        return NextResponse.json({ error: "Invalid application data" }, { status: 400 });
      }
    } else {
      // Process form fields (legacy vacancy.formFields flow)
      for (const field of vacancy.formFields) {
        const fieldValue = formData.get(field.id);

        if (field.required && !fieldValue) {
          return NextResponse.json(
            { error: `${field.label} is required` },
            { status: 400 },
          );
        }

        if (field.type === "pdf") {
          // Handle PDF file upload
          const file = formData.get(field.id) as File | null;
          if (file && file.size > 0) {
            try {
              const buffer = await file.arrayBuffer();
              const { public_id, secure_url } = await uploadApplicationFileToCloudinary(
                Buffer.from(buffer),
                file.name,
                "pdf",
                vacancyId,
              );

              responses.push({
                fieldId: field.id,
                fieldLabel: field.label,
                fieldType: "pdf",
                value: public_id,
                fileUrl: secure_url,
              });

              uploadedFiles.push({ publicId: public_id, fieldId: field.id });
            } catch (error) {
              console.error("Failed to upload PDF:", error);
              return NextResponse.json(
                { error: `Failed to upload ${field.label}` },
                { status: 500 },
              );
            }
          }
        } else {
          // Handle other field types
          if (fieldValue) {
            if (field.type === "checkbox") {
              // Checkbox values come as array or single value
              const checkboxValues = formData.getAll(field.id) as string[];
              responses.push({
                fieldId: field.id,
                fieldLabel: field.label,
                fieldType: field.type,
                value: checkboxValues.length > 1 ? checkboxValues : fieldValue.toString(),
              });
            } else {
              responses.push({
                fieldId: field.id,
                fieldLabel: field.label,
                fieldType: field.type,
                value: fieldValue.toString(),
              });
            }
          }
        }
      }
    }

    // Create application record
    const application = await createApplication({
      vacancyId: new ObjectId(vacancyId),
      userId: user._id!,
      userEmail: user.email,
      userFullName: user.fullName,
      userPhone: user.phone,
      responses,
      status: "submitted",
    });

    // Generate thank you PDF
    try {
      const pdfBuffer = await generateApplicationThankYouPDF({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        jobTitle: vacancy.title,
      });

      const { public_id } = await uploadPDFToCloudinary(
        pdfBuffer,
        `thank-you-${application._id?.toString()}.pdf`,
        "application-thank-you",
      );

      // Update application with PDF reference
      await (await import("@/services/vacancy-application-service")).updateApplication(
        application._id!,
        { pdfCloudinaryPublicId: public_id },
      );
    } catch (error) {
      console.error("Failed to generate or upload thank you PDF:", error);
      // Continue anyway - application is created, PDF generation is just bonus
    }

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
