import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequestCookies } from "@/lib/admin-auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import {
  createHomeService,
  deleteHomeService,
  getAllHomeServices,
  getHomeServiceById,
  getHomeServicesSectionMeta,
  type HomeServiceItem,
  upsertHomeServicesSectionMeta,
  updateHomeService,
} from "@/services/home-services-service";

function normalizePayload(data: Partial<HomeServiceItem>) {
  return {
    title: data.title?.trim() || "",
    description: data.description?.trim() || "",
    route: data.route?.trim() || "",
    stat: data.stat?.trim() || "",
    imageUrl: data.imageUrl?.trim() || "",
    imagePublicId: data.imagePublicId?.trim() || "",
    displayOrder:
      typeof data.displayOrder === "number" && Number.isFinite(data.displayOrder)
        ? data.displayOrder
        : 0,
    isActive: data.isActive !== false,
  };
}

function hasRequiredFields(data: ReturnType<typeof normalizePayload>) {
  return Boolean(data.title && data.description && data.route);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    const id = url.searchParams.get("id");

    if (scope === "meta") {
      const meta = await getHomeServicesSectionMeta();
      return NextResponse.json(meta || null);
    }

    if (id) {
      const item = await getHomeServiceById(id);
      return NextResponse.json(item || null);
    }

    const items = await getAllHomeServices();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching home services:", error);
    return NextResponse.json(
      { error: "Failed to fetch home services" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = normalizePayload(
      (await request.json()) as Partial<Omit<HomeServiceItem, "_id">>,
    );

    if (!hasRequiredFields(payload)) {
      return NextResponse.json(
        { error: "Title, description, and route are required." },
        { status: 400 },
      );
    }

    const created = await createHomeService(payload);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Error creating home service:", error);
    return NextResponse.json(
      { error: "Failed to create home service" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const scope = url.searchParams.get("scope");
    const id = url.searchParams.get("id");

    if (scope === "meta") {
      const data = (await request.json()) as {
        heading?: string;
        description?: string;
      };

      const meta = await upsertHomeServicesSectionMeta({
        heading: data.heading?.trim() || "",
        description: data.description?.trim() || "",
      });

      return NextResponse.json(meta);
    }

    if (!id) {
      return NextResponse.json({ error: "ID parameter required" }, { status: 400 });
    }

    const data = (await request.json()) as Partial<HomeServiceItem> & {
      removedImagePublicId?: string;
    };
    const payload = normalizePayload(data);

    if (!hasRequiredFields(payload)) {
      return NextResponse.json(
        { error: "Title, description, and route are required." },
        { status: 400 },
      );
    }

    if (data.removedImagePublicId) {
      try {
        await deleteCloudinaryImage(data.removedImagePublicId);
      } catch (error) {
        console.error("Failed to delete replaced home service image:", error);
      }
    }

    const updated = await updateHomeService(id, payload);

    if (!updated) {
      return NextResponse.json(
        { error: "Home service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating home service:", error);
    return NextResponse.json(
      { error: "Failed to update home service" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter required" }, { status: 400 });
    }

    const existing = await getHomeServiceById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Home service not found" },
        { status: 404 },
      );
    }

    if (existing.imagePublicId) {
      try {
        await deleteCloudinaryImage(existing.imagePublicId);
      } catch (error) {
        console.error("Failed to delete home service image:", error);
      }
    }

    const deleted = await deleteHomeService(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete home service" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting home service:", error);
    return NextResponse.json(
      { error: "Failed to delete home service" },
      { status: 500 },
    );
  }
}
