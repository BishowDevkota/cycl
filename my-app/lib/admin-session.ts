import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = JWTPayload & {
  role: "admin";
  email: string;
};

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable.");
  }

  return new TextEncoder().encode(secret);
}

export async function signAdminSession(input: {
  adminId: string;
  email: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({ role: "admin", email: input.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.adminId)
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_DURATION_SECONDS)
    .sign(getAuthSecret());
}

export async function verifyAdminSession(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

export function getSessionMaxAgeSeconds(): number {
  return SESSION_DURATION_SECONDS;
}
