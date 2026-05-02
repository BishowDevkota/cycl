import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminSession, ADMIN_SESSION_COOKIE } from "@/lib/admin-session";
import {
  createVacancy,
  getAllVacancies,
  FormField,
} from "@/services/vacancy-service";
import { ObjectId } from "mongodb";

export async function GET(): Promise<NextResponse> {
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

    const vacancies = await getAllVacancies(new ObjectId(session.sub));

    return NextResponse.json(vacancies, { status: 200 });
  } catch (error) {
    console.error("Error fetching vacancies:", error);
    return NextResponse.json(
      { error: "Failed to fetch vacancies" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
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
    } = body;

    // Validate required fields
    if (!title || !description || !department || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate form fields
    if (!Array.isArray(formFields)) {
      return NextResponse.json(
        { error: "formFields must be an array" },
        { status: 400 },
      );
    }

    // Validate each form field
    for (const field of formFields) {
      if (!field.id || !field.label || !field.type) {
        return NextResponse.json(
          { error: "Each form field must have id, label, and type" },
          { status: 400 },
        );
      }

      const validTypes = ["text", "email", "phone", "textarea", "select", "checkbox", "pdf"];
      if (!validTypes.includes(field.type)) {
        return NextResponse.json(
          { error: `Invalid field type: ${field.type}` },
          { status: 400 },
        );
      }
    }

    const vacancy = await createVacancy({
      title,
      description,
      department,
      location,
      salary: salary || undefined,
      experience: experience || undefined,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      formFields: formFields as FormField[],
      isActive: true,
      createdBy: new ObjectId(session.sub),
    });

    return NextResponse.json(
      {
        message: "Vacancy created successfully",
        vacancy,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating vacancy:", error);
    return NextResponse.json(
      { error: "Failed to create vacancy" },
      { status: 500 },
    );
  }
}
