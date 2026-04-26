import Link from "next/link";

export default function AdminHomePage() {
  return (
    <main className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-zinc-900">
        Homepage Management
      </h1>
      <p className="mt-3 text-zinc-600">
        Choose what you want to manage for the public homepage.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/home/hero"
          className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-md"
        >
          <p className="text-lg font-semibold text-zinc-900">Hero Section</p>
          <p className="mt-2 text-sm text-zinc-600">
            Manage the hero carousel, slides, and call-to-action buttons.
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-zinc-900">
            Manage hero
          </span>
        </Link>

        <Link
          href="/admin/home/contact"
          className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-md"
        >
          <p className="text-lg font-semibold text-zinc-900">Contact Details</p>
          <p className="mt-2 text-sm text-zinc-600">
            Manage phone, email, facebook, and whatsapp contact information.
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-zinc-900">
            Manage contacts
          </span>
        </Link>

        <Link
          href="/admin/home/about-company-info"
          className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-md"
        >
          <p className="text-lg font-semibold text-zinc-900">About Company Info</p>
          <p className="mt-2 text-sm text-zinc-600">
            Manage the heading and description that describe the company.
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-zinc-900">
            Manage about info
          </span>
        </Link>

        <Link
          href="/admin/home/message-from-ceo"
          className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-md"
        >
          <p className="text-lg font-semibold text-zinc-900">Message From CEO</p>
          <p className="mt-2 text-sm text-zinc-600">
            Manage the CEO message content, text, and uploaded image.
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-zinc-900">
            Manage CEO message
          </span>
        </Link>

        <Link
          href="/admin/home/company-stats"
          className="group rounded-xl border border-zinc-200 p-5 transition hover:border-zinc-300 hover:shadow-md"
        >
          <p className="text-lg font-semibold text-zinc-900">Company Stats</p>
          <p className="mt-2 text-sm text-zinc-600">
            Manage homepage statistics like branches, centers, deposits, and staff.
          </p>
          <span className="mt-4 inline-flex text-sm font-medium text-zinc-900">
            Manage company stats
          </span>
        </Link>
      </div>
    </main>
  );
}