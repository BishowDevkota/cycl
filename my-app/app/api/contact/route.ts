import { NextResponse } from "next/server";
import { getContactDetails, type ContactDetails } from "@/services/contact-service";

type ContactItemLike =
  | ContactDetails["phone"]
  | {
      text?: unknown;
      link?: unknown;
    }
  | string
  | null
  | undefined;

function normalizeContactItem(item: ContactItemLike) {
  if (typeof item === "string") {
    return { text: item, link: "" };
  }

  return {
    text: typeof item?.text === "string" ? item.text : "",
    link: typeof item?.link === "string" ? item.link : "",
  };
}

function normalizeStoredContact(contact: ContactDetails): ContactDetails {
  return {
    ...contact,
    phone: normalizeContactItem(contact.phone),
    email: normalizeContactItem(contact.email),
    facebook: normalizeContactItem(contact.facebook),
    whatsapp: normalizeContactItem(contact.whatsapp),
    location: normalizeContactItem(contact.location),
  };
}

export async function GET() {
  try {
    const contact = await getContactDetails();

    if (!contact) {
      return NextResponse.json(
        { error: "Contact details not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(normalizeStoredContact(contact), { status: 200 });
  } catch (error) {
    console.error("Error fetching public contact details:", error);
    return NextResponse.json(
      { error: "Failed to retrieve contact details" },
      { status: 500 },
    );
  }
}
