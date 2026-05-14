import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";
import { getApplicationById, updateApplication } from "@/services/vacancy-application-service";
import { getVacancyById } from "@/services/vacancy-service";
import { createEsewaInitPayload, getEsewaConfig } from "@/lib/esewa";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyUserSession(token);
    if (!session?.sub) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.userId.toString() !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get vacancy to retrieve application fee
    const vacancy = await getVacancyById(application.vacancyId.toString());
    if (!vacancy) {
      return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
    }

    const amount = vacancy.applicationFee || 100;

    const txPrefix = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const txSuffix = Math.random().toString(36).slice(2, 8);
    const transactionUuid = `app-${txPrefix}-${id.slice(-6)}-${txSuffix}`;

    const locale = process.env.NEXT_PUBLIC_LOCALE || "en";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const returnTo = `/${locale}/dashboard/applications?applicationId=${id}`;

    const successUrl = `${baseUrl}/${locale}/payment/esewa/callback?outcome=success&return_to=${encodeURIComponent(returnTo)}`;
    const failureUrl = `${baseUrl}/${locale}/payment/esewa/callback?outcome=failure&return_to=${encodeURIComponent(returnTo)}`;

    const payload = createEsewaInitPayload({
      totalAmount: amount,
      transactionUuid,
      successUrl,
      failureUrl,
    });

    await updateApplication(id, {
      payment: JSON.stringify({
        transactionUuid,
        amount,
        status: "PENDING",
        initiatedAt: new Date().toISOString(),
      }),
    });

    return NextResponse.json({
      formUrl: getEsewaConfig().formUrl,
      payload,
    });
  } catch (error) {
    console.error("Failed to initiate payment:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 },
    );
  }
}