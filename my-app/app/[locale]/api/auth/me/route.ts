import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";
import { getUserById } from "@/services/user-service";

export async function GET(_request: NextRequest): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
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

    return NextResponse.json(
      {
        user: {
          id: user._id?.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
