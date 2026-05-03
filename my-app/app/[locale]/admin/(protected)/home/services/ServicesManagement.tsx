"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { HomeServiceItem } from "@/services/home-services-service";

type FormState = Omit<HomeServiceItem, "_id" | "createdAt" | "updatedAt">;

function createEmptyForm(): FormState {
  return {
    title: "",
    "title-en": "",
    "title-ne": "",
    description: "",
    "description-en": "",
    "description-ne": "",
    route: "",
    stat: "",
    "stat-en": "",
    "stat-ne": "",
    imageUrl: "",
    imagePublicId: "",
    displayOrder: 0,
    isActive: true,
  };
}

export default function ServicesManagement() {
  const [items, setItems] = useState<HomeServiceItem[]>([]);
  const [sectionHeading, setSectionHeading] = useState("");
  const [sectionHeadingEn, setSectionHeadingEn] = useState("");
  const [sectionHeadingNe, setSectionHeadingNe] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [sectionDescriptionEn, setSectionDescriptionEn] = useState("");
  const [sectionDescriptionNe, setSectionDescriptionNe] = useState("");
  const [savingSection, setSavingSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(createEmptyForm());

  const fetchItems = useCallback(async () => {
    try {
      const [itemsResponse, metaResponse] = await Promise.all([
        fetch("/api/admin/home/services"),
        fetch("/api/admin/home/services?scope=meta"),
      ]);

      if (!itemsResponse.ok) {
        throw new Error("Failed to fetch");
      }

      const data = (await itemsResponse.json()) as HomeServiceItem[];
      setItems(Array.isArray(data) ? data : []);

      if (metaResponse.ok) {
        const meta = (await metaResponse.json()) as {
          heading?: string;
          description?: string;
          "heading-en"?: string;
          "heading-ne"?: string;
          "description-en"?: string;
          "description-ne"?: string;
        } | null;

        setSectionHeading(meta?.heading || "");
        setSectionHeadingEn(meta?.["heading-en"] || meta?.heading || "");
        setSectionHeadingNe(meta?.["heading-ne"] || meta?.heading || "");
        setSectionDescription(meta?.description || "");
        setSectionDescriptionEn(meta?.["description-en"] || meta?.description || "");
        setSectionDescriptionNe(meta?.["description-ne"] || meta?.description || "");
      }
    } catch {
      setError("Failed to load home services");
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
    const titleEn = formData["title-en"].trim() || formData.title.trim();
    const titleNe = formData["title-ne"].trim() || titleEn;
    const descriptionEn = formData["description-en"].trim() || formData.description.trim();
    const descriptionNe = formData["description-ne"].trim() || descriptionEn;

    if (!titleEn || !titleNe || !descriptionEn || !descriptionNe || !formData.route.trim()) {
      setError("Title, description, and route are required");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/home/services?id=${editingId}`
        : "/api/admin/home/services";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: titleEn,
          "title-en": titleEn,
          "title-ne": titleNe,
          description: descriptionEn,
          "description-en": descriptionEn,
          "description-ne": descriptionNe,
        }),
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
      setError(err instanceof Error ? err.message : "Failed to save home service");
    }
  };

  const handleSaveSectionMeta = async () => {
    try {
      setSavingSection(true);
      const response = await fetch("/api/admin/home/services?scope=meta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: sectionHeadingEn.trim() || sectionHeading.trim(),
          "heading-en": sectionHeadingEn.trim() || sectionHeading.trim(),
          "heading-ne": sectionHeadingNe.trim() || sectionHeadingEn.trim() || sectionHeading.trim(),
          description: sectionDescriptionEn.trim() || sectionDescription.trim(),
          "description-en": sectionDescriptionEn.trim() || sectionDescription.trim(),
          "description-ne": sectionDescriptionNe.trim() || sectionDescriptionEn.trim() || sectionDescription.trim(),
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to save section content");
      }

      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save section content");
    } finally {
      setSavingSection(false);
    }
  };

  const handleEdit = (item: HomeServiceItem) => {
    setEditingId(item._id?.toString() || null);
    setFormData({
      title: item.title,
      "title-en": item["title-en"] || item.title,
      "title-ne": item["title-ne"] || item.title,
      description: item.description,
      "description-en": item["description-en"] || item.description,
      "description-ne": item["description-ne"] || item.description,
      route: item.route,
      stat: item.stat,
      "stat-en": item["stat-en"] || item.stat,
      "stat-ne": item["stat-ne"] || item.stat,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
      displayOrder: item.displayOrder,
      isActive: item.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service card?")) return;

    try {
      const response = await fetch(`/api/admin/home/services?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setError("");
      await fetchItems();
    } catch {
      setError("Failed to delete home service");
    }
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(createEmptyForm());
  };

  if (loading) {
    return <div className="p-6">Loading home services...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-2 text-3xl font-bold">Manage Home Services</h1>
      <p className="mb-6 text-sm text-gray-600">
        Add, edit, delete, and reorder cards shown in the homepage services section.
      </p>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Section Heading and Description</h2>
        <p className="mb-4 text-sm text-gray-600">
          This controls the main title and subtitle shown under the fixed &quot;Our Services&quot; line.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Main Heading (English)</label>
            <input
              type="text"
              value={sectionHeadingEn}
              onChange={(event) => {
                setSectionHeading(event.target.value);
                setSectionHeadingEn(event.target.value);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="What We Offer"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Main Heading (Nepali)</label>
            <input
              type="text"
              value={sectionHeadingNe}
              onChange={(event) => setSectionHeadingNe(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="हाम्रो सेवाहरू"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Description (English)</label>
            <textarea
              value={sectionDescriptionEn}
              onChange={(event) => {
                setSectionDescription(event.target.value);
                setSectionDescriptionEn(event.target.value);
              }}
              className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Empowering members with trusted financial solutions..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description (Nepali)</label>
            <textarea
              value={sectionDescriptionNe}
              onChange={(event) => setSectionDescriptionNe(event.target.value)}
              className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="विश्वसनीय वित्तीय समाधानमार्फत सदस्यहरूलाई सशक्त बनाउँदै..."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveSectionMeta}
          disabled={savingSection}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingSection ? "Saving..." : "Save Section Content"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {editingId ? "Edit Service Card" : "Create Service Card"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Title (English) *</label>
              <input
                type="text"
                value={formData["title-en"]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    title: event.target.value,
                    "title-en": event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Micro Enterprise Loan"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Title (Nepali) *</label>
              <input
                type="text"
                value={formData["title-ne"]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    "title-ne": event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="सूक्ष्म उद्यम ऋण"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description (English) *</label>
              <textarea
                value={formData["description-en"]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: event.target.value,
                    "description-en": event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Short summary shown in the card"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Description (Nepali) *</label>
              <textarea
                value={formData["description-ne"]}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    "description-ne": event.target.value,
                  }))
                }
                className="min-h-24 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="कार्डमा देखाइने छोटो विवरण"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Route *</label>
              <input
                type="text"
                value={formData.route}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, route: event.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="/loans/micro-enterprise-loan"
              />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Stat Badge (English)</label>
                <input
                  type="text"
                  value={formData["stat-en"] || formData.stat}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      stat: event.target.value,
                      "stat-en": event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="13.25% Annual"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Stat Badge (Nepali)</label>
                <input
                  type="text"
                  value={formData["stat-ne"] || ""}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, "stat-ne": event.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="१३.२५% वार्षिक"
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Display Order</label>
                <input
                  type="number"
                  value={String(formData.displayOrder)}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: Number(event.target.value) || 0,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="0"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  Active
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Image (optional)</label>
              {formData.imageUrl ? (
                <div className="mb-3 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={formData.imageUrl}
                    alt="Service preview"
                    width={1200}
                    height={800}
                    className="h-44 w-full object-cover"
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
          <h2 className="mb-4 text-xl font-semibold">Saved Service Cards</h2>

          {items.length === 0 ? (
            <p className="text-gray-500">No service cards created yet.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id?.toString()} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item["title-en"] || item.title}</h3>
                      {item["title-ne"] ? (
                        <p className="text-sm text-gray-500">{item["title-ne"]}</p>
                      ) : null}
                    </div>
                    <span
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={800}
                      height={450}
                      className="mt-3 h-32 w-full rounded-lg object-cover"
                    />
                  ) : null}

                  <p className="mt-3 text-sm text-gray-700">{item["description-en"] || item.description}</p>
                  {item["description-ne"] ? (
                    <p className="mt-2 text-sm text-gray-500">{item["description-ne"]}</p>
                  ) : null}

                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    <p><span className="font-medium">Route:</span> {item.route}</p>
                    <p><span className="font-medium">Stat:</span> {item["stat-en"] || item.stat || "-"}</p>
                    {item["stat-ne"] ? (
                      <p><span className="font-medium">Stat (NP):</span> {item["stat-ne"]}</p>
                    ) : null}
                    <p><span className="font-medium">Order:</span> {item.displayOrder}</p>
                  </div>

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
