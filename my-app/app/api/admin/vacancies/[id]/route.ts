import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import {
  getVacancyById,
  updateVacancy,
  deleteVacancy,
  FormField,
} from "@/services/vacancy-service";
import {
  getApplicationsByVacancyId,
  deleteApplicationsByVacancyId,
} from "@/services/vacancy-application-service";
import { deleteCloudinaryFile } from "@/lib/cloudinary";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// Verify admin
async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return await verifyAdminSession(token);
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const session = await verifyAdmin();
    if (!session || !session.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid vacancy ID" },
        { status: 400 },
      );
    }

    const vacancy = await getVacancyById(id);
    if (!vacancy) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 },
      );
    }

    // Check if admin owns this vacancy
    if (vacancy.createdBy.toString() !== session.sub) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    return NextResponse.json(vacancy, { status: 200 });
  } catch (error) {
    console.error("Error fetching vacancy:", error);
    return NextResponse.json(
      { error: "Failed to fetch vacancy" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const session = await verifyAdmin();
    if (!session || !session.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid vacancy ID" },
        { status: 400 },
      );
    }

    const vacancy = await getVacancyById(id);
    if (!vacancy) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 },
      );
    }

    // Check if admin owns this vacancy
    if (vacancy.createdBy.toString() !== session.sub) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      department,
      location,
      salary,
      experience,
      applicationDeadline,
      formFields,
      isActive,
    } = body;

    // Validate form fields if provided
    if (formFields && !Array.isArray(formFields)) {
      return NextResponse.json(
        { error: "formFields must be an array" },
        { status: 400 },
      );
    }

    if (formFields) {
      for (const field of formFields) {
        if (!field.id || !field.label || !field.type) {
          return NextResponse.json(
            { error: "Each form field must have id, label, and type" },
            { status: 400 },
          );
        }
      }
    }

    const updates: {
      title?: string;
      description?: string;
      department?: string;
      location?: string;
      salary?: string;
      experience?: string;
      applicationDeadline?: Date;
      formFields?: FormField[];
      isActive?: boolean;
    } = {};

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (department) updates.department = department;
    if (location) updates.location = location;
    if (salary) updates.salary = salary;
    if (experience) updates.experience = experience;
    if (applicationDeadline) updates.applicationDeadline = new Date(applicationDeadline);
    if (formFields) updates.formFields = formFields;
    if (typeof isActive === "boolean") updates.isActive = isActive;

    const updatedVacancy = await updateVacancy(id, updates);

    return NextResponse.json(
      {
        message: "Vacancy updated successfully",
        vacancy: updatedVacancy,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating vacancy:", error);
    return NextResponse.json(
      { error: "Failed to update vacancy" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const session = await verifyAdmin();
    if (!session || !session.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid vacancy ID" },
        { status: 400 },
      );
    }

    const vacancy = await getVacancyById(id);
    if (!vacancy) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 },
      );
    }

    // Check if admin owns this vacancy
    if (vacancy.createdBy.toString() !== session.sub) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    // Get all applications for this vacancy
    const applications = await getApplicationsByVacancyId(id);

    // Delete all associated files from Cloudinary
    for (const app of applications) {
      if (app.pdfCloudinaryPublicId) {
        try {
          await deleteCloudinaryFile(app.pdfCloudinaryPublicId);
        } catch (error) {
          console.error("Failed to delete thank you PDF:", error);
        }
      }

      // Delete PDF files uploaded by applicants
      for (const response of app.responses) {
        if (response.fieldType === "pdf") {
          try {
            await deleteCloudinaryFile(response.value as string);
          } catch (error) {
            console.error("Failed to delete applicant PDF:", error);
          }
        }
      }
    }

    // Delete all applications from database
    await deleteApplicationsByVacancyId(id);

    // Delete vacancy
    await deleteVacancy(id);

    return NextResponse.json(
      {
        message: "Vacancy deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting vacancy:", error);
    return NextResponse.json(
      { error: "Failed to delete vacancy" },
      { status: 500 },
    );
  }
}
