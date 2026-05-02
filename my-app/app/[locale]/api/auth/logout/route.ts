import { NextResponse } from "next/server";
import { USER_SESSION_COOKIE } from "@/lib/user-session";

export async function POST(): Promise<NextResponse> {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 },
    );

    response.cookies.delete(USER_SESSION_COOKIE);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
