"use client";

import { useState } from "react";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ValidationErrors = Partial<Record<keyof ContactFormState, string>>;

const initialState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState>(initialState);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const updateField = (field: keyof ContactFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        errors?: ValidationErrors;
        error?: string;
      };

      if (!response.ok) {
        setErrors(payload.errors ?? {});
        setSubmitError(payload.error ?? "Unable to submit your message right now.");
        return;
      }

      setFormState(initialState);
      setErrors({});
      setSuccessMessage(
        payload.message ?? "Thank you. Your message has been submitted successfully.",
      );
    } catch {
      setSubmitError("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[#d5e4ec] bg-white p-5 shadow-[0_18px_36px_rgba(16,53,74,0.08)] sm:p-6"
    >
      <h3 className="text-xl font-semibold text-[#123451]">Send Us a Message</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Fill in the form and our team will get back to you as soon as possible.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Name</span>
          <input
            type="text"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
            placeholder="Your full name"
            autoComplete="name"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
            placeholder="you@example.com"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Subject</span>
          <input
            type="text"
            value={formState.subject}
            onChange={(event) => updateField("subject", event.target.value)}
            className="w-full rounded-lg border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
            placeholder="How can we help?"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Message</span>
          <textarea
            value={formState.message}
            onChange={(event) => updateField("message", event.target.value)}
            className="min-h-[150px] w-full rounded-lg border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
            placeholder="Write your message"
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-600">{errors.message}</p>
          )}
        </label>
      </div>

      {submitError && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      {successMessage && (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 inline-flex items-center rounded-full bg-[#0d837f] px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Submit Message"}
      </button>
    </form>
  );
}
