export function hasRichTextContent(value?: string | null) {
  if (!value) {
    return false;
  }

  const text = value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();

  return text.length > 0;
}
