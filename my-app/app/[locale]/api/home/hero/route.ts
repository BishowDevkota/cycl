import { NextResponse } from "next/server";
import { getHeroSection } from "@/services/hero-service";

export async function GET() {
  try {
    const hero = await getHeroSection();
    return NextResponse.json(hero || null);
  } catch (error) {
    console.error("Error fetching hero section:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero section" },
      { status: 500 },
    );
  }
}