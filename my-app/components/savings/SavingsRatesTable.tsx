const savingsRows = [
  { sn: "1", type: "Compulsory saving", rate: "7.5%" },
  { sn: "2", type: "Personal saving", rate: "7.5%" },
  { sn: "4", type: "Special saving", rate: "8-9.5%" },
  { sn: "3", type: "Cyc pension saving", rate: "13.30%" },
  { sn: "5", type: "Welfare Saving", rate: "7.5%" },
  { sn: "6", type: "Housing saving", rate: "7.5%" },
  { sn: "7", type: "Child saving", rate: "7.5%" },
  { sn: "8", type: "Festival saving", rate: "7.5%" },
  { sn: "9", type: "Jewelry saving", rate: "7.5%" },
  { sn: "10", type: "Cyc Pewa Saving", rate: "7.5%" },
] as const;

export function SavingsRatesTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#d7e6ee] bg-white shadow-[0_14px_28px_rgba(12,49,72,0.08)]">
      <table className="min-w-full text-sm">
        <thead className="bg-[linear-gradient(90deg,#ecf7fa_0%,#e8f6f4_100%)] text-left text-[#123451]">
          <tr>
            <th className="px-4 py-3 font-semibold sm:px-5">S.N</th>
            <th className="px-4 py-3 font-semibold sm:px-5">Saving Type</th>
            <th className="px-4 py-3 font-semibold sm:px-5">Interest Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {savingsRows.map((row) => (
            <tr
              key={`${row.sn}-${row.type}`}
              className="border-t border-[#e3edf3] text-slate-700 odd:bg-white even:bg-[#f9fcfe]"
            >
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
