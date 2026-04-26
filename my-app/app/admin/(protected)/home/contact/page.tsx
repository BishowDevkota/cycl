"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactDetails } from "@/lib/contact-service";

type ContactField = keyof Omit<ContactDetails, "_id" | "isActive" | "createdAt" | "updatedAt">;
type ContactProperty = "text" | "link";

function createEmptyContactDetails(): Omit<ContactDetails, "_id"> {
  return {
    phone: { text: "", link: "" },
    email: { text: "", link: "" },
    facebook: { text: "", link: "" },
    whatsapp: { text: "", link: "" },
    location: { text: "", link: "" },
    isActive: false,
  };
}

export default function ContactManagement() {
  const [contacts, setContacts] = useState<ContactDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<ContactDetails, "_id">>(
    createEmptyContactDetails(),
  );

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/contact");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleContactFieldChange = (
    contact: ContactField,
    property: ContactProperty,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [contact]: {
        ...prev[contact],
        [property]: value,
      },
    }));
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleEdit = (contact: ContactDetails) => {
    setEditingId(contact._id?.toString() || null);
    setFormData({
      phone: contact.phone,
      email: contact.email,
      facebook: contact.facebook,
      whatsapp: contact.whatsapp,
      location: contact.location,
      isActive: contact.isActive,
    });
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(createEmptyContactDetails());
  };

  const handleSave = async () => {
    const requiredFields: ContactField[] = ["phone", "email", "facebook", "whatsapp", "location"];
    const hasMissingFields = requiredFields.some((key) => {
      const item = formData[key];
      return !item.text.trim() || !item.link.trim();
    });

    if (hasMissingFields) {
      setError("All contact details require both text and link");
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/home/contact?id=${editingId}`
        : "/api/admin/home/contact";
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
      setFormData(createEmptyContactDetails());
      setEditingId(null);
      await fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save contact details");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      const response = await fetch(`/api/admin/home/contact?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setError("");
      await fetchContacts();
    } catch {
      setError("Failed to delete contact details");
    }
  };

  if (loading)
    return <div className="p-4">Loading contact details...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Contact Details</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Contact Details" : "Create New Contact Details"}
          </h2>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Text
              </label>
              <input
                type="text"
                value={formData.phone.text}
                onChange={(e) =>
                  handleContactFieldChange("phone", "text", e.target.value)
                }
                placeholder="e.g., +1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="block text-sm font-medium mt-2 mb-1">
                Phone Link
              </label>
              <input
                type="text"
                value={formData.phone.link}
                onChange={(e) =>
                  handleContactFieldChange("phone", "link", e.target.value)
                }
                placeholder="e.g., tel:+15551234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Text
              </label>
              <input
                type="text"
                value={formData.email.text}
                onChange={(e) =>
                  handleContactFieldChange("email", "text", e.target.value)
                }
                placeholder="e.g., contact@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="block text-sm font-medium mt-2 mb-1">
                Email Link
              </label>
              <input
                type="text"
                value={formData.email.link}
                onChange={(e) =>
                  handleContactFieldChange("email", "link", e.target.value)
                }
                placeholder="e.g., mailto:contact@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Facebook Text
              </label>
              <input
                type="text"
                value={formData.facebook.text}
                onChange={(e) =>
                  handleContactFieldChange("facebook", "text", e.target.value)
                }
                placeholder="e.g., facebook.com/yourpage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="block text-sm font-medium mt-2 mb-1">
                Facebook Link
              </label>
              <input
                type="text"
                value={formData.facebook.link}
                onChange={(e) =>
                  handleContactFieldChange("facebook", "link", e.target.value)
                }
                placeholder="e.g., https://facebook.com/yourpage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium mb-1">
                WhatsApp Text
              </label>
              <input
                type="text"
                value={formData.whatsapp.text}
                onChange={(e) =>
                  handleContactFieldChange("whatsapp", "text", e.target.value)
                }
                placeholder="e.g., +1 (555) 123-4567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="block text-sm font-medium mt-2 mb-1">
                WhatsApp Link
              </label>
              <input
                type="text"
                value={formData.whatsapp.link}
                onChange={(e) =>
                  handleContactFieldChange("whatsapp", "link", e.target.value)
                }
                placeholder="e.g., https://wa.me/15551234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Location Text
              </label>
              <input
                type="text"
                value={formData.location.text}
                onChange={(e) =>
                  handleContactFieldChange("location", "text", e.target.value)
                }
                placeholder="e.g., 123 Business Street, City, Country"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label className="block text-sm font-medium mt-2 mb-1">
                Location Link
              </label>
              <input
                type="text"
                value={formData.location.link}
                onChange={(e) =>
                  handleContactFieldChange("location", "link", e.target.value)
                }
                placeholder="e.g., https://maps.google.com/... or tel: or mailto:"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={handleActiveChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-medium">
                Make this the active contact details
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  onClick={handleNew}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Details List</h2>

          {contacts.length === 0 ? (
            <p className="text-gray-500">No contact details created yet.</p>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div
                  key={contact._id?.toString()}
                  className={`p-4 border rounded-lg ${
                    contact.isActive
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      {contact.isActive && (
                        <span className="inline-block bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold mb-2">
                          Active
                        </span>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <p className="font-medium">Phone:</p>
                          <p className="text-gray-600">{contact.phone.text}</p>
                        </div>
                        <div>
                          <p className="font-medium">Email:</p>
                          <p className="text-gray-600">{contact.email.text}</p>
                        </div>
                        <div>
                          <p className="font-medium">Facebook:</p>
                          <p className="text-gray-600 truncate">
                            {contact.facebook.text}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">WhatsApp:</p>
                          <p className="text-gray-600">{contact.whatsapp.text}</p>
                        </div>
                      </div>
                      <div className="text-sm mb-2">
                        <p className="font-medium">Location:</p>
                        <p className="text-gray-600">{contact.location.text}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id?.toString() || "")}
                      className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 text-sm font-medium"
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
