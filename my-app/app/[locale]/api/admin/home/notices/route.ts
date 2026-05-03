import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequestCookies } from "@/lib/admin-auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import {
  createHomeNotice,
  deleteHomeNotice,
  getAllHomeNotices,
  getHomeNoticeById,
  type HomeNotice,
  updateHomeNotice,
} from "@/services/home-notice-service";
import { hasRichTextContent } from "@/lib/rich-text";

function hasImage(data: Partial<HomeNotice>) {
  return Boolean(data.imageUrl?.trim() && data.imagePublicId?.trim());
}

function hasText(data: Partial<HomeNotice>) {
  const text = data.text?.trim() || data["text-en"]?.trim() || data["text-ne"]?.trim() || "";
  return hasRichTextContent(text);
}

function hasRequiredFields(data: Partial<HomeNotice>) {
  return hasImage(data) || hasText(data);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSessionFromRequestCookies();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (id) {
      const notice = await getHomeNoticeById(id);
      return NextResponse.json(notice || null);
    }

    const notices = await getAllHomeNotices();
    return NextResponse.json(notices);
  } catch (error) {
    console.error("Error fetching home notices:", error);
    return NextResponse.json(
      { error: "Failed to fetch home notices" },
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

    const data = (await request.json()) as Partial<Omit<HomeNotice, "_id">>;

    if (!hasRequiredFields(data)) {
      return NextResponse.json(
        { error: "Add text, an image, or both." },
        { status: 400 },
      );
    }

    const notice = await createHomeNotice({
      title: data.title?.trim() || data["title-en"]?.trim() || "",
      "title-en": data["title-en"]?.trim() || data.title?.trim() || "",
      "title-ne": data["title-ne"]?.trim() || data.title?.trim() || data["title-en"]?.trim() || "",
      text: data.text?.trim() || data["text-en"]?.trim() || "",
      "text-en": data["text-en"]?.trim() || data.text?.trim() || "",
      "text-ne": data["text-ne"]?.trim() || data.text?.trim() || data["text-en"]?.trim() || "",
      imageUrl: data.imageUrl?.trim() || "",
      imagePublicId: data.imagePublicId?.trim() || "",
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Error creating home notice:", error);
    return NextResponse.json(
      { error: "Failed to create home notice" },
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
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID parameter required" }, { status: 400 });
    }

    const data = (await request.json()) as Partial<HomeNotice> & {
      removedImagePublicId?: string;
    };

    if (!hasRequiredFields(data)) {
      return NextResponse.json(
        { error: "Add text, an image, or both." },
        { status: 400 },
      );
    }

    if (data.removedImagePublicId) {
      try {
        await deleteCloudinaryImage(data.removedImagePublicId);
      } catch (error) {
        console.error("Failed to delete replaced home notice image:", error);
      }
    }

    const notice = await updateHomeNotice(id, {
      title: data.title?.trim() || data["title-en"]?.trim() || "",
      "title-en": data["title-en"]?.trim() || data.title?.trim() || "",
      "title-ne": data["title-ne"]?.trim() || data.title?.trim() || data["title-en"]?.trim() || "",
      text: data.text?.trim() || data["text-en"]?.trim() || "",
      "text-en": data["text-en"]?.trim() || data.text?.trim() || "",
      "text-ne": data["text-ne"]?.trim() || data.text?.trim() || data["text-en"]?.trim() || "",
      imageUrl: data.imageUrl?.trim() || "",
      imagePublicId: data.imagePublicId?.trim() || "",
    });

    if (!notice) {
      return NextResponse.json(
        { error: "Home notice not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(notice);
  } catch (error) {
    console.error("Error updating home notice:", error);
    return NextResponse.json(
      { error: "Failed to update home notice" },
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

    const existing = await getHomeNoticeById(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Home notice not found" },
        { status: 404 },
      );
    }

    if (existing.imagePublicId) {
      try {
        await deleteCloudinaryImage(existing.imagePublicId);
      } catch (error) {
        console.error("Failed to delete home notice image:", error);
      }
    }

    const deleted = await deleteHomeNotice(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete home notice" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting home notice:", error);
    return NextResponse.json(
      { error: "Failed to delete home notice" },
      { status: 500 },
    );
  }
}
