import { NextResponse } from "next/server";
import { getContactDetails } from "@/lib/contact-service";

export async function GET() {
  try {
    const contact = await getContactDetails();
    
    if (!contact) {
      return NextResponse.json(null);
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact details:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact details" },
      { status: 500 },
    );
  }
}
