import { NextRequest, NextResponse } from "next/server";
import {
  decodeEsewaSuccessData,
  getEsewaConfig,
  verifyEsewaPayloadSignature,
} from "@/lib/esewa";

interface VerifyBody {
  data?: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const body = (await request.json()) as VerifyBody;
    const encodedData = String(body.data || "").trim();
    if (!encodedData) {
      return NextResponse.json(
        { error: "Missing eSewa response data" },
        { status: 400 },
      );
    }

    const decoded = decodeEsewaSuccessData(encodedData);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid eSewa response payload" },
        { status: 400 },
      );
    }

    const config = getEsewaConfig();

    const signatureOk = verifyEsewaPayloadSignature(decoded as Record<string, unknown>, config.secretKey);
    if (!signatureOk) {
      return NextResponse.json(
        { error: "Invalid eSewa signature" },
        { status: 400 },
      );
    }

    const totalAmount = String(decoded.total_amount || "");
    const statusCheckUrl = new URL(config.statusCheckUrl);
    statusCheckUrl.searchParams.set("product_code", String(decoded.product_code || ""));
    statusCheckUrl.searchParams.set("total_amount", totalAmount);
    statusCheckUrl.searchParams.set("transaction_uuid", String(decoded.transaction_uuid || ""));

    const statusResponse = await fetch(statusCheckUrl.toString(), {
      cache: "no-store",
    });

    if (!statusResponse.ok) {
      const text = await statusResponse.text();
      return NextResponse.json(
        { error: "Failed status check", details: text },
        { status: 502 },
      );
    }

    const statusData = await statusResponse.json();
    const isComplete = String(statusData.status || "").toUpperCase() === "COMPLETE";

    if (!isComplete) {
      return NextResponse.json(
        {
          verified: false,
          status: statusData.status || "UNKNOWN",
          message: "Payment is not complete",
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      verified: true,
      status: statusData.status,
      transactionUuid: statusData.transaction_uuid || decoded.transaction_uuid,
      totalAmount: Number(statusData.total_amount || decoded.total_amount || 0),
      refId: statusData.ref_id || null,
      transactionCode: decoded.transaction_code,
      raw: decoded,
    });
  } catch (error) {
    console.error("Failed to verify eSewa payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
