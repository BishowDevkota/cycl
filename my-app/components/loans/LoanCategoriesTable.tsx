"use client";

import { useTranslations } from "next-intl";

export function LoanCategoriesTable() {
  // 1. Point to the base 'loans' scope
  const t = useTranslations("loans");

  // 2. Use t.raw to fetch the nested array from your new JSON
  const rows = t.raw("table.data") as Array<{ sn: string | number; type: string; rate: string }>;

  return (
    <div className="overflow-x-auto bg-off-white">
      <table className="min-w-full text-lg text-bold bg-white">
        <thead className="bg-[#0d837f] text-left text-[18px] text-white">
          <tr>
            {/* 3. Update header keys to match the nested JSON */}
            <th className="px-4 py-3 font-semibold sm:px-5 h-5 text-xl">{t("table.columns.sn")}</th>
            <th className="px-4 py-3 font-semibold sm:px-5 h-4 text-xl">{t("table.columns.type")}</th>
            <th className="px-4 py-3 font-semibold sm:px-5 h-4 text-xl">{t("table.columns.rate")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.sn}-${index}`}
              className="border-t border-[#e3edf3] text-slate-700 odd:bg-white even:bg-[#f9fcfe] text-[16px]"
            >
              {/* 4. Use the values directly from the array */}
              <td className="px-4 py-3 font-medium text-[#123451] sm:px-5">{row.sn}</td>
              <td className="px-4 py-3 sm:px-5">{row.type}</td>
              <td className="px-4 py-3 font-semibold text-[#0d837f] sm:px-5">{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}