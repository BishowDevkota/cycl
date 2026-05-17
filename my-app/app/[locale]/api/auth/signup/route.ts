import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/services/user-service";
import { signUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, token } = body;

    // reCAPTCHA verification
    const recaptchaRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    );
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Validations
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ fullName, email, phone, passwordHash });

    const sessionToken = await signUserSession({
      userId: user._id!.toString(),
      email: user.email,
      fullName: user.fullName,
    });

    // SUCCESS RESPONSE: Crucial for handleCaptchaSubmit
    const response = NextResponse.json(
      {
        success: true, 
        message: "User created successfully",
        user: {
          id: user._id?.toString(),
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
        },
      },
      { status: 201 }
    );

    response.cookies.set(USER_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}