import { ContactForm } from "@/components/contact/ContactForm";
import { PublicPageShell } from "@/components/public/PublicPageShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { branchDirectoryByProvince, contactDirectory } from "@/lib/public-content";

export default function ContactPage() {
  const highlightedBranches = branchDirectoryByProvince
    .flatMap((group) => group.branches)
    .slice(0, 6);

  return (
    <PublicPageShell
      eyebrow="Contact"
      title="Head Office, Branch Locations, and Contact Form"
      description="Contact details, map embed, and inquiry form are structured for production deployment. Form inputs are validated on the server for name, email, subject, and message."
      actions={[
        { label: "View Branch Directory", href: "/branches" },
        { label: "Read Notices", href: "/notices" },
      ]}
    >
      <section className="rounded-3xl border border-[#d9e8ef] bg-white p-6 shadow-[0_20px_40px_rgba(13,44,62,0.08)] sm:p-8">
        <SectionHeading
          eyebrow="Head Office"
          title="Get In Touch"
          description="Reach us through phone, email, social channels, or by visiting the head office location shown on the map."
        />

        <article className="overflow-hidden rounded-3xl border border-[#d7e6ee] bg-[#f9fcfe] shadow-[0_18px_36px_rgba(16,53,74,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <iframe
                title="CYC Nepal Head Office Map"
                src={contactDirectory.mapEmbedUrl}
                loading="lazy"
                className="h-80 w-full border-0 lg:h-136"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="border-t border-[#d7e6ee] p-4">
                <p className="text-sm font-semibold text-[#123451]">Head Office Address</p>
                <p className="mt-1 text-sm text-slate-700">{contactDirectory.headOffice}</p>
              </div>
            </div>

            <div className="border-t border-[#d7e6ee] p-5 lg:border-l lg:border-t-0 lg:p-6">
              <h3 className="text-lg font-semibold text-[#123451]">Contact Details</h3>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-[#123451]">Phone:</span>{" "}
                  <a href="tel:+97761590894" className="transition hover:text-[#0d837f]">
                    {contactDirectory.phone}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-[#123451]">Email:</span>{" "}
                  <a href={`mailto:${contactDirectory.email}`} className="transition hover:text-[#0d837f]">
                    {contactDirectory.email}
                  </a>
                </p>
                <p>
                  <span className="font-semibold text-[#123451]">Support Hours:</span>{" "}
                  {contactDirectory.supportHours}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-[#123451]">Social Media</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {contactDirectory.socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-[#cbdde6] px-4 py-2 text-sm font-semibold text-[#274963] transition hover:border-[#0d837f] hover:text-[#0d837f]"
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.95fr] xl:grid-cols-[1.25fr_0.9fr]">
        <ContactForm />

        <article className="rounded-2xl border border-[#d5e4ec] bg-white p-5 shadow-[0_18px_36px_rgba(16,53,74,0.08)] sm:p-6">
          <h3 className="text-xl font-semibold text-[#123451]">Popular Branch Contacts</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Quick contacts from major service locations across provinces.
          </p>

          <div className="mt-5 space-y-3">
            {highlightedBranches.map((branch) => (
              <div key={branch.id} className="rounded-xl border border-[#dce8ef] bg-[#f8fbfd] p-3">
                <p className="text-sm font-semibold text-[#123451]">{branch.branchName}</p>
                <p className="mt-1 text-sm text-slate-600">{branch.address}</p>
                <p className="mt-1 text-sm text-slate-700">{branch.phone}</p>
                <p className="text-sm text-slate-700">{branch.email}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </PublicPageShell>
  );
}
