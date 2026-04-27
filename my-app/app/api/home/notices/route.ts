import { NextResponse } from "next/server";
import { getAllHomeNotices } from "@/services/home-notice-service";

export async function GET() {
  try {
    const notices = await getAllHomeNotices();
    return NextResponse.json(notices);
  } catch (error) {
    console.error("Error fetching public home notices:", error);
    return NextResponse.json(
      { error: "Failed to fetch home notices" },
      { status: 500 },
    );
  }
}
