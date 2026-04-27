import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be 80 characters or less"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(120, "Email must be 120 characters or less"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject must be 120 characters or less"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be 2000 characters or less"),
});

type ContactMessage = z.infer<typeof contactMessageSchema>;

function mapValidationErrors(error: z.ZodError<ContactMessage>) {
  const fieldErrors = error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    email: fieldErrors.email?.[0],
    subject: fieldErrors.subject?.[0],
    message: fieldErrors.message?.[0],
  };
}

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON payload",
      },
      {
        status: 400,
      },
    );
  }

  const validationResult = contactMessageSchema.safeParse(payload);

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        errors: mapValidationErrors(validationResult.error),
      },
      {
        status: 400,
      },
    );
  }

  // In production, this payload should be persisted or forwarded to a messaging pipeline.
  const message = validationResult.data;
  console.info("Contact inquiry received:", {
    name: message.name,
    email: message.email,
    subject: message.subject,
  });

  return NextResponse.json(
    {
      success: true,
      message: "Thank you for contacting us. Our team will reach out shortly.",
    },
    {
      status: 201,
    },
  );
}
