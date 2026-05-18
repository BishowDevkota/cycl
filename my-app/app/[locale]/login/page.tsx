"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";
import { Eye, EyeOff } from "lucide-react";
import { handleCaptchaSubmit } from "@/lib/handle-captcha-submit";
// Import the Client-safe signIn function from NextAuth
import { signIn } from "next-auth/react";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
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

  // Google Sign-In handler for Client Components
  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const next = searchParams.get("next");
      const locale = params.locale || 'ne';
      const callbackUrl = next ? `/${locale}${next}` : `/${locale}/vacancies`;

      // reCAPTCHA is typically bypassed for trusted OAuth providers like Google, 
      // but callbackUrl handles your localized redirection after a successful login.
      await signIn("google", { callbackUrl });
    } catch (err) {
      setError("Something went wrong with Google Sign-In.");
    }
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

    // FIXED: Changed setPromptLoading(true) to your actual state hook setLoading(true)
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

        {/* GOOGLE OAUTH BUTTON SECTION */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-medium transition shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.3 1.55-1.17 2.86-2.47 3.74v3.13h3.99c2.34-2.13 3.61-5.32 3.61-8.72z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.99-3.13c-1.1.74-2.51 1.18-3.94 1.18-3.04 0-5.63-2.06-6.55-4.83H1.46v3.23C3.43 21.36 7.42 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.45 14.31a7.22 7.22 0 0 1 0-4.62V6.46H1.46a11.94 11.94 0 0 0 0 11.08l3.99-3.23z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.42 0 3.43 2.64 1.46 6.46l3.99 3.23c.92-2.77 3.51-4.83 6.55-4.83z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* DIVIDER BETWEEN OAUTH AND CREDENTIALS */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

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