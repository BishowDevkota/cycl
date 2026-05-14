"use client";

import { useCallback, useEffect, useState } from "react";
import type { ContactDetails } from "@/services/contact-service";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  Save, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  ChevronRight, 
  CheckCircle2,
  RefreshCw,
  Settings
} from "lucide-react";
import { FaFacebook as Facebook } from "react-icons/fa";


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

  // Sync Logic
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [syncLabel, setSyncLabel] = useState<string>("Just now");

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - lastSynced.getTime()) / 1000);
      if (seconds < 60) setSyncLabel("Just now");
      else if (seconds < 3600) setSyncLabel(`${Math.floor(seconds / 60)}m ago`);
      else setSyncLabel(`${Math.floor(seconds / 3600)}h ago`);
    }, 10000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  const fetchContacts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/contact");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : []);
      setLastSynced(new Date());
      setSyncLabel("Just now");
    } catch {
      setError("Failed to load contact details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void fetchContacts();
    }, 0);
    return () => window.clearTimeout(timerId);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNew = () => {
    setEditingId(null);
    setFormData(createEmptyContactDetails());
    setError("");
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
    if (!confirm("Are you sure?")) return;
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

  if (loading) return <div className="p-12 text-slate-400 animate-pulse">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#334155] font-sans pb-20">
      {/* Header Bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <nav className="flex items-center text-sm font-medium text-slate-500">
            <span>Home</span>
            <ChevronRight size={16} className="mx-2 opacity-30" />
            <span className="text-slate-900">Contact Details</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Last synced: {syncLabel}</span>
          </div>
          <button 
            onClick={handleSave}
            className="bg-[#40C9C0] hover:bg-[#34b1a9] text-white px-5 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save size={16} />
            {editingId ? "UPDATE CONTACT" : "SAVE CONTACT"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded shadow-sm">
              {error}
            </div>
          )}

          <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Communication Channels</h3>
              <Settings size={14} className="text-slate-300" />
            </div>
            
            <div className="p-6 space-y-6">
              {/* Field mapping to reduce repetitive code */}
              {[
                { id: "phone" as ContactField, label: "Phone", icon: <Phone size={14}/>, placeholder: "+1 (555) 000-0000", linkPlaceholder: "tel:+15550000000" },
                { id: "email" as ContactField, label: "Email", icon: <Mail size={14}/>, placeholder: "info@example.com", linkPlaceholder: "mailto:info@example.com" },
                { id: "facebook" as ContactField, label: "Facebook", icon: <Facebook size={14}/>, placeholder: "facebook.com/username", linkPlaceholder: "https://facebook.com/..." },
                { id: "whatsapp" as ContactField, label: "WhatsApp", icon: <MessageSquare size={14}/>, placeholder: "+1 (555) 000-0000", linkPlaceholder: "https://wa.me/..." },
                { id: "location" as ContactField, label: "Location", icon: <MapPin size={14}/>, placeholder: "City, Country", linkPlaceholder: "https://maps.google.com/..." },
              ].map((field) => (
                <div key={field.id} className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-[#40C9C0]">
                    {field.icon}
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">{field.label} Details</label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">DISPLAY TEXT</span>
                      <input
                        type="text"
                        value={formData[field.id].text}
                        onChange={(e) => handleContactFieldChange(field.id, "text", e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#40C9C0] transition-colors"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">ACTION LINK (URL/TEL)</span>
                      <input
                        type="text"
                        value={formData[field.id].link}
                        onChange={(e) => handleContactFieldChange(field.id, "link", e.target.value)}
                        placeholder={field.linkPlaceholder}
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-[#40C9C0] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Status Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Visibility</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">Active Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={handleActiveChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#40C9C0]"></div>
              </label>
            </div>
            {editingId ? (
              <button onClick={handleNew} className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X size={14} /> CANCEL EDITING
              </button>
            ) : (
              <div className="mt-4 p-3 border border-dashed border-slate-200 rounded-lg text-center">
                <p className="text-[10px] text-slate-400 font-medium italic">Creating new contact profile</p>
              </div>
            )}
          </div>

          {/* Existing Items List */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Archived Profiles</h3>
              {!editingId && <Plus size={14} className="text-slate-300" />}
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
              {contacts.length === 0 ? (
                <p className="p-6 text-xs text-slate-400 italic">No profiles created yet.</p>
              ) : (
                contacts.map((contact) => (
                  <div key={contact._id?.toString()} className="p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${contact.isActive ? 'bg-[#40C9C0]/10 text-[#40C9C0]' : 'bg-slate-100 text-slate-400'}`}>
                        <Phone size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-700 truncate">{contact.email.text || "Contact Profile"}</h4>
                          {contact.isActive && <CheckCircle2 size={12} className="text-[#40C9C0]" />}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium truncate">{contact.location.text}</p>
                        
                        <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(contact)} className="text-[10px] font-bold text-[#40C9C0] flex items-center gap-1 cursor-pointer hover:underline">
                            <Edit3 size={10} /> EDIT
                          </button>
                          <button onClick={() => handleDelete(contact._id?.toString() || "")} className="text-[10px] font-bold text-red-400 flex items-center gap-1 cursor-pointer hover:underline">
                            <Trash2 size={10} /> DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}