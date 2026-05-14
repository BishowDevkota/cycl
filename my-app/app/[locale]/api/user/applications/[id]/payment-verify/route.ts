import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { verifyUserSession, USER_SESSION_COOKIE } from "@/lib/user-session";
import { getApplicationById, updateApplication } from "@/services/vacancy-application-service";

interface VerificationData {
  verified?: boolean;
  status?: string;
  transactionUuid?: string;
  totalAmount?: number | string;
  transactionCode?: string;
  refId?: string | null;
  raw?: Record<string, unknown>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const { id: applicationId } = await params;
    if (!ObjectId.isValid(applicationId)) {
      return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
    }

    const application = await getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.userId.toString() !== session.sub) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as VerificationData;

    const {
      transactionUuid,
      status,
      totalAmount,
      transactionCode,
      refId,
    } = body;

    if (!transactionUuid || !status) {
      return NextResponse.json(
        { error: "Missing required payment fields (transactionUuid, status)" },
        { status: 400 },
      );
    }

    // Ensure payment is COMPLETE
    if (status.toUpperCase() !== "COMPLETE") {
      return NextResponse.json(
        { error: `Payment status is not complete (received: ${status})` },
        { status: 400 },
      );
    }

    // Verify that a payment initiation record exists and matches this transaction
    let storedPayment: Record<string, unknown> = {};
    if (application.payment) {
      try {
        storedPayment = JSON.parse(application.payment);
      } catch (parseErr) {
        console.warn("Failed to parse stored payment JSON:", parseErr);
      }
    }

    const storedTransactionUuid = storedPayment.transactionUuid as string | undefined;
    if (!storedTransactionUuid) {
      return NextResponse.json(
        { error: "No pending payment found for this application. Please initiate payment first." },
        { status: 400 },
      );
    }

    if (storedTransactionUuid !== transactionUuid) {
      return NextResponse.json(
        { error: "Transaction UUID mismatch" },
        { status: 400 },
      );
    }

    // Update paymentData response
    const paymentResponseIdx = application.responses.findIndex((r) => r.fieldId === "paymentData");
    if (paymentResponseIdx === -1) {
      return NextResponse.json(
        { error: "Payment data response not found" },
        { status: 400 },
      );
    }

    let existingPaymentData: Record<string, unknown> = {};
    try {
      existingPaymentData = JSON.parse(application.responses[paymentResponseIdx].value as string);
    } catch {
      // ignore
    }

    const newPaymentData = {
      ...existingPaymentData,
      verified: true,
      status: status.toUpperCase(),
      transactionUuid,
      transactionCode,
      refId: refId || null,
      totalAmount: totalAmount ?? existingPaymentData.totalAmount ?? 0,
      verifiedAt: new Date().toISOString(),
    };

    const updatedResponses = [...application.responses];
    updatedResponses[paymentResponseIdx] = {
      ...updatedResponses[paymentResponseIdx],
      value: JSON.stringify(newPaymentData),
    };

    // Also update top-level payment field for consistency
    const newTopPayment = {
      transactionUuid,
      amount: totalAmount,
      status: "COMPLETE",
      verified: true,
      verifiedAt: new Date().toISOString(),
      ...(refId ? { refId } : {}),
      ...(transactionCode ? { transactionCode } : {}),
    };

    const updatedApplication = await updateApplication(applicationId, {
      payment: JSON.stringify(newTopPayment),
      responses: updatedResponses,
    });

    return NextResponse.json({
      success: true,
      message: "Payment status updated",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Payment verification update error:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 },
    );
  }
}
