import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequestCookies } from "@/lib/admin-auth";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import {
  createMessageFromCeo,
  deleteMessageFromCeo,
  getAllMessagesFromCeo,
  updateMessageFromCeo,
  type MessageFromCeo,
} from "@/lib/message-from-ceo-service";
import { hasRichTextContent } from "@/lib/rich-text";

function hasRequiredFields(data: Partial<MessageFromCeo>) {
  return Boolean(
    data.heading?.trim() &&
      hasRichTextContent(data.description) &&
      data.imageUrl?.trim() &&
      data.imagePublicId?.trim(),
  );
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
      const messages = await getAllMessagesFromCeo();
      const message = messages.find((item) => item._id?.toString() === id);

      return NextResponse.json(message || null);
    }

    const messages = await getAllMessagesFromCeo();
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching message from CEO:", error);
    return NextResponse.json(
      { error: "Failed to fetch message from CEO" },
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

    const data = (await request.json()) as Partial<Omit<MessageFromCeo, "_id">>;

    if (!hasRequiredFields(data)) {
      return NextResponse.json(
        { error: "Heading, description, and image are required" },
        { status: 400 },
      );
    }

    const message = await createMessageFromCeo({
      heading: data.heading?.trim() || "",
      description: data.description?.trim() || "",
      imageUrl: data.imageUrl?.trim() || "",
      imagePublicId: data.imagePublicId?.trim() || "",
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message from CEO:", error);
    return NextResponse.json(
      { error: "Failed to create message from CEO" },
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

    const body = (await request.json()) as Partial<MessageFromCeo> & {
      removedImagePublicId?: string;
    };

    if (!hasRequiredFields(body)) {
      return NextResponse.json(
        { error: "Heading, description, and image are required" },
        { status: 400 },
      );
    }

    if (body.removedImagePublicId) {
      try {
        await deleteCloudinaryImage(body.removedImagePublicId);
      } catch (error) {
        console.error("Failed to delete removed CEO image:", error);
      }
    }

    const message = await updateMessageFromCeo(id, {
      heading: body.heading?.trim(),
      description: body.description?.trim(),
      imageUrl: body.imageUrl?.trim(),
      imagePublicId: body.imagePublicId?.trim(),
    });

    if (!message) {
      return NextResponse.json(
        { error: "Message from CEO not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating message from CEO:", error);
    return NextResponse.json(
      { error: "Failed to update message from CEO" },
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

    const messages = await getAllMessagesFromCeo();
    const message = messages.find((item) => item._id?.toString() === id);

    if (!message) {
      return NextResponse.json(
        { error: "Message from CEO not found" },
        { status: 404 },
      );
    }

    if (message.imagePublicId) {
      try {
        await deleteCloudinaryImage(message.imagePublicId);
      } catch (error) {
        console.error("Failed to delete CEO image:", error);
      }
    }

    const deleted = await deleteMessageFromCeo(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete message from CEO" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message from CEO:", error);
    return NextResponse.json(
      { error: "Failed to delete message from CEO" },
      { status: 500 },
    );
  }
}