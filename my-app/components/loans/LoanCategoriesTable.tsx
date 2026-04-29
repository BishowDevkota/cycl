const loanRows = [
  { sn: "1", type: "General Loan", rate: "15%" },
  { sn: "2", type: "Seasonal Loan", rate: "15%" },
  { sn: "3", type: "Housing Loan", rate: "15%" },
  { sn: "4", type: "Microenterprise Loan", rate: "15%" },
  { sn: "5", type: "Renewable Energy Loan", rate: "15%" },
  { sn: "6", type: "Foreign Employment Loan", rate: "15%" },
  { sn: "7", type: "Education Loan", rate: "15%" },
  { sn: "8", type: "Cyc Emergency Loan", rate: "15%" },
  { sn: "9", type: "Cyc Enterprise Development Loan", rate: "12.5%" },
] as const;

export function LoanCategoriesTable() {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_4px_10px_rgba(12,49,72,0.1)]">
      <table className="min-w-full text-sm border border-[#e3edf3]">
        <thead className="bg-teal-deep text-left text-[18px]  text-off-white">
          <tr>
            <th className="px-4 py-3 font-semibold sm:px-5">S.N</th>
            <th className="px-4 py-3 font-semibold sm:px-5">Loan Type</th>
            <th className="px-4 py-3 font-semibold sm:px-5">Interest Rate (%)</th>
          </tr>
        </thead>
        <tbody>
          {loanRows.map((row) => (
            <tr
              key={`${row.sn}-${row.type}`}
              className="border-t border-[#e3edf3] text-slate-700 odd:bg-white even:bg-[#f9fcfe] text-[16px]"
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
