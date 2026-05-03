"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { hasRichTextContent } from "@/lib/rich-text";
import { useLocale } from "next-intl";

type HomeNotice = {
  _id?: string;
  title: string;
  "title-en"?: string;
  "title-ne"?: string;
  text: string;
  "text-en"?: string;
  "text-ne"?: string;
  imageUrl: string;
  imagePublicId: string;
  createdAt?: string;
  updatedAt?: string;
};

export function ActiveNoticePopup() {
  const locale = useLocale();
  const [notices, setNotices] = useState<HomeNotice[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    let active = true;

    const fetchNotices = async () => {
      try {
        const response = await fetch("/api/home/notices", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load notices");
        }

        const data = (await response.json()) as HomeNotice[];
        const safeData = Array.isArray(data) ? data : [];

        if (!active) {
          return;
        }

        setNotices(safeData);
        setSelectedId(safeData[0]?._id || "");
        setIsOpen(safeData.length > 0);
      } catch {
        if (!active) {
          return;
        }

        setNotices([]);
        setSelectedId("");
        setIsOpen(false);
      }
    };

    void fetchNotices();

    return () => {
      active = false;
    };
  }, []);

  const selectedNotice =
    notices.find((notice) => notice._id === selectedId) ?? notices[0];

  const localizedNotice = useMemo(() => {
    if (!selectedNotice) {
      return null;
    }

    const title =
      locale === "ne"
        ? selectedNotice["title-ne"] || selectedNotice.title || selectedNotice["title-en"] || "Notice"
        : selectedNotice["title-en"] || selectedNotice.title || selectedNotice["title-ne"] || "Notice";
    const text =
      locale === "ne"
        ? selectedNotice["text-ne"] || selectedNotice.text || selectedNotice["text-en"] || ""
        : selectedNotice["text-en"] || selectedNotice.text || selectedNotice["text-ne"] || "";

    return { ...selectedNotice, title, text };
  }, [locale, selectedNotice]);

  const selectedTitle = useMemo(() => {
    if (!localizedNotice) {
      return "Notice";
    }

    return localizedNotice.title?.trim() || "Notice";
  }, [localizedNotice]);

  if (!notices.length) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-120 grid place-items-center bg-slate-950/45 px-4 py-8">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#cfe2ea] bg-white shadow-[0_28px_60px_rgba(2,30,45,0.35)]">
            <div className="flex items-center justify-between border-b border-[#e4edf1] bg-[#f5fafc] px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#0d837f]">
                  Active Notices
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[#123451] sm:text-xl">
                  Latest Announcements
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6e5ec] text-[#37526c] transition hover:bg-white"
                aria-label="Close notice popup"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_1.4fr]">
              <div className="max-h-105 overflow-y-auto border-b border-[#e8eff3] bg-[#fbfdff] p-3 md:max-h-125 md:border-b-0 md:border-r">
                {notices.map((notice) => {
                  const isSelected = notice._id === selectedNotice?._id;
                  const listTitle =
                    locale === "ne"
                      ? notice["title-ne"] || notice.title || notice["title-en"] || "Notice"
                      : notice["title-en"] || notice.title || notice["title-ne"] || "Notice";
                  const listDate = notice.updatedAt || notice.createdAt;

                  return (
                    <button
                      key={notice._id || listTitle}
                      type="button"
                      onClick={() => setSelectedId(notice._id || "")}
                      className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition ${
                        isSelected
                          ? "border-[#0d837f]/40 bg-[#e8f7f4]"
                          : "border-transparent bg-white hover:border-[#cae2ea]"
                      }`}
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-[#123451]">
                        {listTitle}
                      </p>
                      {listDate ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {new Date(listDate).toLocaleDateString("en-NP", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <article className="p-5 sm:p-6">
                <h4 className="text-lg font-semibold text-[#123451] sm:text-xl">
                  {selectedTitle}
                </h4>
                {localizedNotice?.updatedAt || localizedNotice?.createdAt ? (
                  <p className="mt-2 text-sm font-medium text-[#0d837f]">
                    Updated on {new Date(localizedNotice?.updatedAt || localizedNotice?.createdAt || "").toLocaleDateString("en-NP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                ) : null}

                {localizedNotice?.imageUrl ? (
                  <div className="relative mt-4 h-52 w-full overflow-hidden rounded-xl border border-[#e4edf1] bg-[#f8fbfd] sm:h-64">
                    <Image
                      src={localizedNotice.imageUrl}
                      alt={selectedTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                {hasRichTextContent(localizedNotice?.text || "") ? (
                  <div
                    className="rich-text-content mt-4 text-sm leading-7 text-slate-700 sm:text-base"
                    dangerouslySetInnerHTML={{ __html: localizedNotice?.text || "" }}
                  />
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center rounded-full border border-[#cadbe4] px-5 py-2.5 text-sm font-semibold text-[#29455e] transition hover:bg-[#f4f9fc]"
                  >
                    Dismiss
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-5 z-90 inline-flex items-center gap-2 rounded-full bg-[#0d837f] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(13,131,127,0.35)] transition hover:brightness-110"
        >
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#ffd9a4]" aria-hidden="true" />
          Active Notices
        </button>
      )}
    </>
  );
}
