import { useTranslations } from 'next-intl';

type RichTextContentProps = {
  html: string | undefined;
  className?: string;
};

export function RichTextContent({ html, className = "" }: RichTextContentProps) {
  if (!html) return null; // Don't render the wrapper div if there's no content

  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
