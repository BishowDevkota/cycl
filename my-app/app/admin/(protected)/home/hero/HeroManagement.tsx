"use client";

import { useCallback, useEffect, useState } from "react";
import type { HeroSection, HeroSlide } from "@/lib/hero-service";

type HeroSlideInput = HeroSlide & { clientId: string };

function createEmptySlide(): HeroSlideInput {
  return {
    clientId: crypto.randomUUID(),
    title: "",
    subtitle: "",
    imageUrl: "",
    imagePublicId: "",
    ctaText: "",
    ctaLink: "",
  };
}

function createEmptyForm() {
  return {
    title: "",
    slides: [createEmptySlide()],
    isActive: false,
  };
}

export default function HeroManagement() {
  const [heroes, setHeroes] = useState<HeroSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingSlideId, setUploadingSlideId] = useState<string | null>(null);
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>(
    [],
  );
  const [formData, setFormData] = useState<
    Omit<HeroSection, "_id" | "slides"> & { slides: HeroSlideInput[] }
  >(createEmptyForm());

  const fetchHeroes = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/hero");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setHeroes(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load hero sections");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  const handleSlideChange = (
    slideId: string,
    field: keyof HeroSlideInput,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      slides: prev.slides.map((slide) =>
        slide.clientId === slideId ? { ...slide, [field]: value } : slide,
      ),
    }));
  };

  const handleAddSlide = () => {
    setFormData((prev) => ({
      ...prev,
      slides: [...prev.slides, createEmptySlide()],
    }));
  };

  const handleRemoveSlide = (slideId: string) => {
    setFormData((prev) => {
      const slideToRemove = prev.slides.find(
        (slide) => slide.clientId === slideId,
      );

      if (slideToRemove?.imagePublicId) {
        setRemovedImagePublicIds((current) => [
          ...current,
          slideToRemove.imagePublicId,
        ]);
      }

      const remainingSlides = prev.slides.filter(
        (slide) => slide.clientId !== slideId,
      );

      return {
        ...prev,
        slides: remainingSlides.length > 0 ? remainingSlides : [createEmptySlide()],
      };
    });
  };

  const handleSlideImageUpload = async (
    slideId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const slide = formData.slides.find((item) => item.clientId === slideId);
    if (!slide) return;

    setUploadingSlideId(slideId);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      if (slide.imagePublicId) {
        uploadFormData.append("oldPublicId", slide.imagePublicId);
      }

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const result = await response.json();

      setFormData((prev) => ({
        ...prev,
        slides: prev.slides.map((item) =>
          item.clientId === slideId
            ? {
                ...item,
                imageUrl: result.secure_url,
                imagePublicId: result.public_id,
              }
            : item,
        ),
      }));
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploadingSlideId(null);
    }
  };

  const handleEdit = (hero: HeroSection) => {
    const slides = hero.slides?.length ? hero.slides : [];

    setEditingId(hero._id?.toString() || null);
    setRemovedImagePublicIds([]);
    setFormData({
      title: hero.title,
      isActive: hero.isActive,
      slides:
        slides.length > 0
          ? slides.map((slide) => ({
              ...slide,
              clientId: crypto.randomUUID(),
            }))
          : [createEmptySlide()],
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Section title is required");
      return;
    }

    if (!formData.slides.length) {
      setError("At least one slide is required");
      return;
    }

    const missingSlide = formData.slides.find(
      (slide) => !slide.title.trim() || !slide.imageUrl || !slide.imagePublicId,
    );

    if (missingSlide) {
      setError("Each slide needs a title and image");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/home/hero?id=${editingId}`
        : "/api/admin/home/hero";
      const method = editingId ? "PUT" : "POST";

      const payload = {
        title: formData.title,
        isActive: formData.isActive,
          slides: formData.slides.map((slide) => ({
            title: slide.title,
            subtitle: slide.subtitle,
            imageUrl: slide.imageUrl,
            imagePublicId: slide.imagePublicId,
            ctaText: slide.ctaText,
            ctaLink: slide.ctaLink,
          })),
        ...(editingId ? { removedImagePublicIds } : {}),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Save failed");

      setFormData(createEmptyForm());
      setEditingId(null);
      setRemovedImagePublicIds([]);
      setError("");
      await fetchHeroes();
    } catch {
      setError("Failed to save hero section");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero section?")) return;

    try {
      const response = await fetch(`/api/admin/home/hero?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");
      await fetchHeroes();
    } catch {
      setError("Failed to delete hero section");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(createEmptyForm());
    setRemovedImagePublicIds([]);
    setError("");
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Homepage Management</h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage the content that appears on the public homepage.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-zinc-500">Hero Section</p>
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit Hero Section" : "Create New Hero Section"}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Control the hero carousel shown at the top of the homepage.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Section Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Homepage Hero"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Slides</h3>
              <button
                type="button"
                onClick={handleAddSlide}
                className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-700"
              >
                Add Slide
              </button>
            </div>

            {formData.slides.map((slide, index) => (
              <div
                key={slide.clientId}
                className="border border-gray-200 rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Slide {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.clientId)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove slide
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Slide Title *
                  </label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) =>
                      handleSlideChange(slide.clientId, "title", e.target.value)
                    }
                    placeholder="Slide title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <textarea
                    value={slide.subtitle}
                    onChange={(e) =>
                      handleSlideChange(slide.clientId, "subtitle", e.target.value)
                    }
                    placeholder="Slide subtitle"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Background Image *
                  </label>
                  {slide.imageUrl && (
                    <div className="mb-4 relative">
                      <img
                        src={slide.imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSlideImageUpload(slide.clientId, e)}
                    disabled={uploadingSlideId === slide.clientId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {uploadingSlideId === slide.clientId && (
                    <p className="mt-2 text-blue-600">Uploading...</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={slide.ctaText}
                      onChange={(e) =>
                        handleSlideChange(
                          slide.clientId,
                          "ctaText",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Get Started"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      CTA Link
                    </label>
                    <input
                      type="text"
                      value={slide.ctaLink}
                      onChange={(e) =>
                        handleSlideChange(
                          slide.clientId,
                          "ctaLink",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., /contact"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={handleActiveChange}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium">
              Set as active hero section
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={uploadingSlideId !== null}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Hero Sections</h2>
        {heroes.length === 0 ? (
          <p className="text-gray-600">No hero sections yet</p>
        ) : (
          heroes.map((hero) => (
            <div
              key={hero._id?.toString()}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex gap-6">
                <div className="w-40 h-40 flex-shrink-0">
                  {hero.slides?.[0]?.imageUrl ? (
                    <img
                      src={hero.slides[0].imageUrl}
                      alt={hero.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-lg bg-zinc-100 flex items-center justify-center text-sm text-zinc-500">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{hero.title}</h3>
                      <p className="text-gray-600 mt-2">
                        {(hero.slides?.length || 0)} slide
                        {hero.slides?.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    {hero.isActive && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleEdit(hero)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hero._id?.toString() || "")}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}