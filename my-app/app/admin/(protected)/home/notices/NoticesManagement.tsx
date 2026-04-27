"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { HomeNotice } from "@/services/home-notice-service";
import { hasRichTextContent } from "@/lib/rich-text";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

function createEmptyForm(): Omit<HomeNotice, "_id" | "createdAt" | "updatedAt"> {
  return {
    title: "",
    text: "",
    imageUrl: "",
    imagePublicId: "",
  };
}

function hasImage(formData: Omit<HomeNotice, "_id" | "createdAt" | "updatedAt">) {
  return Boolean(formData.imageUrl.trim() && formData.imagePublicId.trim());
}

function hasText(formData: Omit<HomeNotice, "_id" | "createdAt" | "updatedAt">) {
  return hasRichTextContent(formData.text);
}

export default function NoticesManagement() {
  const [items, setItems] = useState<HomeNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(createEmptyForm());

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/notices");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load home notices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchItems();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [fetchItems]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      if (formData.imagePublicId) {
        uploadFormData.append("oldPublicId", formData.imagePublicId);
      }

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setFormData((prev) => ({
        ...prev,
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      }));
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!hasImage(formData) && !hasText(formData)) {
      setError("Add text, image, or both.");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/home/notices?id=${editingId}`
        : "/api/admin/home/notices";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save");
      }

      setError("");
      setFormData(createEmptyForm());
      setEditingId(null);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save home notice");
    }
  };

  const handleEdit = (item: HomeNotice) => {
    setEditingId(item._id?.toString() || null);
    setFormData({
      title: item.title,
      text: item.text,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const response = await fetch(`/api/admin/home/notices?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setError("");
      await fetchItems();
    } catch {
      setError("Failed to delete home notice");
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(createEmptyForm());
  };

  if (loading) {
    return <div className="p-6">Loading home notices...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold">Manage Home Notices</h1>
      <p className="mb-6 text-sm text-gray-600">
        Create notices for the homepage popup. You can add text, image, or both.
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? "Edit Home Notice" : "Create Home Notice"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title (optional)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Notice title"
              />
            </div>

            <RichTextEditor
              label="Text Content (optional)"
              value={formData.text}
              onChange={(value) => setFormData((prev) => ({ ...prev, text: value }))}
              placeholder="Write notice text here"
              helperText="If both image and text are added, image is shown first then text."
            />

            <div>
              <label className="mb-1 block text-sm font-medium">Image (optional)</label>
              {formData.imageUrl ? (
                <div className="mb-3 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={formData.imageUrl}
                    alt="Notice preview"
                    width={1200}
                    height={800}
                    className="h-56 w-full object-cover"
                  />
                </div>
              ) : null}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
              {uploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleNew}
                  className="flex-1 rounded-lg bg-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Saved Notices</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">No home notices created yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item._id?.toString()} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title || `Notice ${items.length - index}`}
                  </h3>

                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title || "Notice image"}
                      width={800}
                      height={450}
                      className="mt-3 h-40 w-full rounded-lg object-cover"
                    />
                  ) : null}

                  {hasRichTextContent(item.text) ? (
                    <div
                      className="rich-text-content mt-3 max-h-28 overflow-hidden text-sm text-gray-600"
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    />
                  ) : null}

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex-1 rounded bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id?.toString() || "")}
                      className="flex-1 rounded bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
