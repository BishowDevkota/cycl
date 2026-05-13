"use client";

import { useTranslations } from "next-intl";

export function SavingsRatesTable() {
  // Use the "savings.table" scope from your JSON
  const t = useTranslations("savings.table");

  // Retrieve the array of data from the JSON
  // We use 'raw' to get the actual array structure defined in your translation file
  const rows = t.raw("data") as Array<{ sn: string | number; type: string; rate: string }>;

  return (
    <div className="overflow-x-auto bg-off-white">
      <table className="min-w-full text-lg text-bold bg-white">
        <thead className="bg-[#0d837f] text-left text-[18px] text-white">
          <tr>
            <th className="px-4 py-3 font-semibold sm:px-5 h-5 text-xl">
              {t("columns.sn")}
            </th>
            <th className="px-4 py-3 font-semibold sm:px-5 h-4 text-xl">
              {t("columns.type")}
            </th>
            <th className="px-4 py-3 font-semibold sm:px-5 h-4 text-xl">
              {t("columns.rate")}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.sn}-${index}`}
              className="border-t border-[#e3edf3] text-slate-700 odd:bg-white even:bg-[#f9fcfe] text-[16px]"
            >
              <td className="px-4 py-3 font-medium text-[#123451] sm:px-5">
                {row.sn}
              </td>
              <td className="px-4 py-3 sm:px-5">
                {row.type}
              </td>
              <td className="px-4 py-3 font-semibold text-[#0d837f] sm:px-5">
                {row.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}