"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ApplicationSidebar from "./ApplicationSidebar";
import MyApplicationsTab from "./MyApplicationsTab";
import RedraftApplicationsTab from "./RedraftApplicationsTab";

export default function ApplicationDashboard() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"my-applications" | "redraft">(
    "my-applications"
  );
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push(`/${params.locale}/login`);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push(`/${params.locale}/login`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.locale, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push(`/${params.locale}/`);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">लोड हुँदैछ...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <ApplicationSidebar
        userName={user.fullName}
        email={user.email}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#0d837f] text-white shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">उम्मेदवार ड्यासबोर्ड</h1>
              <p className="text-[#e0f2f1] mt-1">
                आफ्नो आवेदनहरू व्यवस्थापन गर्नुहोस्
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{user.fullName}</p>
              <p className="text-sm text-[#e0f2f1]">{user.email}</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-[#d6e6ed] bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("my-applications")}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === "my-applications"
                    ? "border-[#0d837f] text-[#0d837f]"
                    : "border-transparent text-gray-600 hover:text-[#0d837f]"
                }`}
              >
                मेरा आवेदनहरू
              </button>
              <button
                onClick={() => setActiveTab("redraft")}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === "redraft"
                    ? "border-[#0d837f] text-[#0d837f]"
                    : "border-transparent text-gray-600 hover:text-[#0d837f]"
                }`}
              >
                पुनः तयार आवेदनहरू
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === "my-applications" && <MyApplicationsTab />}
          {activeTab === "redraft" && <RedraftApplicationsTab />}
        </div>
      </div>
    </div>
  );
}
