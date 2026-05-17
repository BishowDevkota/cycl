"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import { handleCaptchaSubmit } from "@/lib/handle-captcha-submit";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Added success state
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);

    await handleCaptchaSubmit({
      endpoint: "/api/auth/login",
      payload: formData,
      recaptchaToken: captchaToken,
      recaptchaRef: recaptchaRef,
      onSuccess: (data) => {
        setSuccess("Login successful! Redirecting...");
        const next = searchParams.get("next");
        const locale = params.locale || 'ne';
        
        // Short delay to show success message
        setTimeout(() => {
          if (next) {
            router.push(`/${locale}${next}`);
          } else {
            router.push(`/${locale}/vacancies`);
          }
        }, 1500);
      },
      onFailure: (errorMessage) => {
        setError(errorMessage);
        setLoading(false);
        setCaptchaToken(null);
        recaptchaRef.current?.reset();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 text-black">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#123451]">Log In</h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to your account to apply for jobs
        </p>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 text-green-700 rounded mb-4 text-sm border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setCaptchaToken(token)}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}