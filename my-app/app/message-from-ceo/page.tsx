import { PublicPageShell } from "@/components/public/PublicPageShell";
import { getMessageFromCeo } from "@/services/message-from-ceo-service";
import { MessageFromCeoSection } from "@/components/public/MessageFromCeoSection";

export default async function MessageFromCeoPage() {
  const messageFromCeo = await getMessageFromCeo();

  return (
    <PublicPageShell
    imageUrl="/banner/banner.jpg"
      eyebrow="Leadership"
      title={messageFromCeo?.heading || "Message From CEO"}
      description="A complete note from the CEO highlighting our institutional vision, service commitment, and direction for sustainable financial inclusion."
      actions={[
        { label: "Back to Home", href: "/" },
        { label: "Contact Us", href: "/contact" },
      ]}
    >
      <MessageFromCeoSection
        messageFromCeo={messageFromCeo}
        buttonLabel="Return Home"
        buttonHref="/"
      />
    </PublicPageShell>
  );
}
