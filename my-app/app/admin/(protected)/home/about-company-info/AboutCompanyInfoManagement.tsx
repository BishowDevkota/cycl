"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { AboutCompanyInfo } from "@/lib/about-company-info-service";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { hasRichTextContent } from "@/lib/rich-text";

function createEmptyForm(): Omit<AboutCompanyInfo, "_id" | "createdAt" | "updatedAt"> {
  return {
    heading: "",
    description: "",
    imageUrl: "",
    imagePublicId: "",
  };
}

export default function AboutCompanyInfoManagement() {
  const [items, setItems] = useState<AboutCompanyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(createEmptyForm());

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/about-company-info");
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load about company info");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchItems();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [fetchItems]);

  const handleSave = async () => {
    if (
      !formData.heading.trim() ||
      !hasRichTextContent(formData.description) ||
      !formData.imageUrl.trim() ||
      !formData.imagePublicId.trim()
    ) {
      setError("Heading, description, and image are required");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/home/about-company-info?id=${editingId}`
        : "/api/admin/home/about-company-info";
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
      setError(err instanceof Error ? err.message : "Failed to save about company info");
    }
  };

  const handleEdit = (item: AboutCompanyInfo) => {
    setEditingId(item._id?.toString() || null);
    setFormData({
      heading: item.heading,
      description: item.description,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const response = await fetch(`/api/admin/home/about-company-info?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setError("");
      await fetchItems();
    } catch {
      setError("Failed to delete about company info");
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(createEmptyForm());
  };

  if (loading) {
    return <div className="p-6">Loading about company info...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold">Manage About Company Info</h1>
      <p className="mb-6 text-sm text-gray-600">
        Create and update the public about-company section.
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? "Edit About Company Info" : "Create About Company Info"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Heading</label>
              <input
                type="text"
                value={formData.heading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, heading: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="About the company"
              />
            </div>

            <div>
              <RichTextEditor
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e }))
                }
                placeholder="Write the about-company description here"
                helperText="Use bold, italic, lists, quotes, and links to format the content."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Image</label>
              {formData.imageUrl ? (
                <div className="mb-3 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={formData.imageUrl}
                    alt="About company preview"
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
          <h2 className="mb-4 text-xl font-semibold">Saved Entries</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">No about-company entries created yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id?.toString()} className="rounded-lg border border-gray-200 p-4">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.heading}
                      width={800}
                      height={450}
                      className="mb-3 h-40 w-full rounded-lg object-cover"
                    />
                  ) : null}
                  <h3 className="text-lg font-semibold text-gray-900">{item.heading}</h3>
                  <div
                    className="rich-text-content mt-2 max-h-32 overflow-hidden text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
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