"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Application {
  _id: string;
  vacancyId: string;
  vacancyTitle: string;
  status: string;
  createdAt: string;
  company?: string;
}

export default function DashboardPage(): React.JSX.Element {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserAndApplications = async () => {
      try {
        // Get current user
        const userResponse = await fetch("/api/auth/me");
        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        const userData = await userResponse.json();
        setUser(userData.user);
      } catch (err) {
        console.error(err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    void fetchUserAndApplications();
  }, [router]);

  const statusColors: { [key: string]: string } = {
    submitted: "bg-blue-100 text-blue-800",
    reviewed: "bg-yellow-100 text-yellow-800",
    selected: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Please log in to view your dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.fullName}!</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Applications</h2>
          <Link
            href="/vacancies"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse More Jobs
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">You haven't applied for any jobs yet.</p>
            <Link
              href="/vacancies"
              className="text-blue-600 hover:underline"
            >
              Explore job openings
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id}
                className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{app.vacancyTitle}</h3>
                  <p className="text-sm text-gray-600">
                    Applied: {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded font-medium text-sm ${
                    statusColors[app.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="text-3xl font-bold text-blue-600 mb-1">
            {applications.filter((a) => a.status === "submitted").length}
          </div>
          <p className="text-gray-600">Submitted</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600 mb-1">
            {applications.filter((a) => a.status === "reviewed").length}
          </div>
          <p className="text-gray-600">Under Review</p>
        </div>

        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {applications.filter((a) => a.status === "selected").length}
          </div>
          <p className="text-gray-600">Selected</p>
        </div>
      </div>
    </div>
  );
}
