import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { setAdminSessionCookie } from "@/lib/admin-auth";
import { signAdminSession } from "@/lib/admin-session";

type AdminRecord = {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  role: "admin";
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 },
      );
    }

    const db = await getDb();
    const admin = await db.collection<AdminRecord>("admins").findOne({
      email,
      role: "admin",
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const token = await signAdminSession({
      adminId: admin._id.toHexString(),
      email: admin.email,
    });

    const response = NextResponse.json({ ok: true });
    await setAdminSessionCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
}
