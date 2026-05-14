"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { HomeNotice } from "@/services/home-notice-service";
import { hasRichTextContent } from "@/lib/rich-text";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  Edit3, 
  Settings, 
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Bell,
  Image as ImageIcon
} from "lucide-react";

function createEmptyForm(): Omit<HomeNotice, "_id" | "createdAt" | "updatedAt"> {
  return {
    title: "",
    "title-en": "",
    "title-ne": "",
    text: "",
    "text-en": "",
    "text-ne": "",
    imageUrl: "",
    imagePublicId: "",
  };
}

function hasImage(formData: Omit<HomeNotice, "_id" | "createdAt" | "updatedAt">) {
  return Boolean(formData.imageUrl?.trim() && formData.imagePublicId?.trim());
}

export default function NoticesManagement() {
  const [items, setItems] = useState<HomeNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(createEmptyForm());
  
  // Sync Logic to match Hero component
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

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home/notices");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
      setLastSynced(new Date());
    } catch {
      setError("Failed to load home notices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      if (formData.imagePublicId) uploadFormData.append("oldPublicId", formData.imagePublicId);

      const response = await fetch("/api/admin/upload", { method: "POST", body: uploadFormData });
      if (!response.ok) throw new Error("Upload failed");

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
    const textEn = formData["text-en"].trim() || formData.text.trim();
    const textNe = formData["text-ne"].trim() || textEn;

    if (!titleEn || !titleNe) return setError("English and Nepali titles are required");

    try {
      const url = editingId ? `/api/admin/home/notices?id=${editingId}` : "/api/admin/home/notices";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: titleEn,
          "title-en": titleEn,
          "title-ne": titleNe,
          text: textEn,
          "text-en": textEn,
          "text-ne": textNe,
        }),
      });

      if (!response.ok) throw new Error("Save failed");
      setFormData(createEmptyForm());
      setEditingId(null);
      setError("");
      await fetchItems();
    } catch {
      setError("Failed to save notice");
    }
  };

  const handleEdit = (item: HomeNotice) => {
    setEditingId(item._id?.toString() || null);
    setFormData({
      title: item.title,
      "title-en": item["title-en"] || item.title,
      "title-ne": item["title-ne"] || item.title,
      text: item.text,
      "text-en": item["text-en"] || item.text,
      "text-ne": item["text-ne"] || item.text,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/admin/home/notices?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      await fetchItems();
    } catch {
      setError("Failed to delete notice");
    }
  };

  if (loading) return <div className="p-12 text-slate-400 animate-pulse">Loading Workspace...</div>;

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#334155] font-sans pb-20">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <nav className="flex items-center text-sm font-medium text-slate-500">
            <span className="cursor-default">Home</span>
            <ChevronRight size={16} className="mx-2 opacity-30" />
            <span className="text-slate-900 cursor-default">Notices Management</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Last synced: {syncLabel}</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={uploading}
            className="bg-[#40C9C0] hover:bg-[#34b1a9] text-white px-5 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {editingId ? "UPDATE NOTICE" : "SAVE NOTICE"}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded shadow-sm">
              {error}
            </div>
          )}

          {/* Configuration Card */}
          <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Notice Content</h3>
              <Settings size={14} className="text-slate-300" />
            </div>
            
            <div className="p-6 space-y-8">
              {/* Title Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                      <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    </div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-tight">Title (English)</label>
                  </div>
                  <input
                    type="text"
                    value={formData["title-en"]}
                    onChange={(e) => setFormData({...formData, title: e.target.value, "title-en": e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#40C9C0]/20 focus:border-[#40C9C0] outline-none transition-all shadow-inner"
                    placeholder="English headline..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 pl-5 uppercase tracking-tight">Title (Nepali)</label>
                  <input
                    type="text"
                    value={formData["title-ne"]}
                    onChange={(e) => setFormData({...formData, "title-ne": e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-md px-4 py-3 text-sm focus:ring-2 focus:ring-[#40C9C0]/20 focus:border-[#40C9C0] outline-none transition-all shadow-inner"
                    placeholder="नेपाली शीर्षक..."
                  />
                </div>
              </div>

              {/* Rich Text Editors */}
              <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Text Content (EN)</label>
                      <span className="text-[10px] text-slate-400 font-medium">RICH EDITOR</span>
                   </div>
                   <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-inner p-1">
                    <RichTextEditor
                      value={formData["text-en"]}
                      onChange={(val) => setFormData(p => ({ ...p, text: val, "text-en": val }))}
                      placeholder="English description..."
                    />
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Text Content (NE)</label>
                      <span className="text-[10px] text-slate-400 font-medium">RICH EDITOR</span>
                   </div>
                   <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-inner p-1">
                    <RichTextEditor
                      value={formData["text-ne"]}
                      onChange={(val) => setFormData(p => ({ ...p, "text-ne": val }))}
                      placeholder="नेपाली विवरण..."
                    />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Media Attachment</h3>
              <Plus size={14} className="text-slate-300" />
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-56 aspect-video bg-white border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center overflow-hidden shrink-0 relative group">
                  {formData.imageUrl ? (
                    <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size={32} className="text-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400">NO MEDIA</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                   <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-700">Notice Banner</h4>
                    <p className="text-xs text-slate-500">Upload an image to display in the notice popup. Maximum 2MB.</p>
                   </div>
                   <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[#40C9C0]/10 file:text-[#40C9C0] hover:file:bg-[#40C9C0]/20 cursor-pointer"
                  />
                  {uploading && <div className="h-1 w-full bg-slate-100 rounded overflow-hidden"><div className="h-full bg-[#40C9C0] animate-progress w-1/2"></div></div>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Publishing</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm font-medium text-slate-600">Active Notice</span>
              <CheckCircle2 size={18} className="text-[#40C9C0]" />
            </div>
            {editingId && (
                <button onClick={() => { setEditingId(null); setFormData(createEmptyForm()); }} className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <X size={14} /> CANCEL EDITING
                </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Existing Notices</h3>
            </div>
            <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
              {items.length === 0 ? (
                <p className="p-6 text-xs text-slate-400 italic text-center">No notices saved.</p>
              ) : (
                items.map((item) => (
                  <div key={item._id?.toString()} className="p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} className="w-full h-full object-cover opacity-80" alt="" />
                        ) : (
                          <Bell size={16} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-700 truncate">{item["title-en"] || "Untitled"}</h4>
                        <p className="text-[10px] text-slate-400 font-medium italic truncate">{item["title-ne"]}</p>
                        <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="text-[10px] font-bold text-[#40C9C0] flex items-center gap-1 cursor-pointer hover:underline"><Edit3 size={10} /> EDIT</button>
                          <button onClick={() => handleDelete(item._id?.toString() || "")} className="text-[10px] font-bold text-red-400 flex items-center gap-1 cursor-pointer hover:underline"><Trash2 size={10} /> DELETE</button>
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

      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress {
          animation: progress 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
}