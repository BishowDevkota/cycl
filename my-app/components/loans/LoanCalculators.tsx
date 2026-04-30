"use client";

import { useMemo, useState } from "react";

function formatNpr(value: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

type LoanCalculatorsProps = {
  mode?: "both" | "emi" | "interest";
};

export function LoanCalculators({ mode = "both" }: LoanCalculatorsProps) {
  const [principal, setPrincipal] = useState("500000");
  const [annualRate, setAnnualRate] = useState("13.25");
  const [tenureMonths, setTenureMonths] = useState("36");

  const [interestPrincipal, setInterestPrincipal] = useState("500000");
  const [interestRate, setInterestRate] = useState("13.25");
  const [interestTenureMonths, setInterestTenureMonths] = useState("36");

  const emiResult = useMemo(() => {
    const principalValue = Number.parseFloat(principal);
    const annualRateValue = Number.parseFloat(annualRate);
    const tenureValue = Number.parseFloat(tenureMonths);

    if (
      Number.isNaN(principalValue) ||
      Number.isNaN(annualRateValue) ||
      Number.isNaN(tenureValue) ||
      principalValue <= 0 ||
      annualRateValue < 0 ||
      tenureValue <= 0
    ) {
      return null;
    }

    const monthlyRate = annualRateValue / 12 / 100;

    if (monthlyRate === 0) {
      const emi = principalValue / tenureValue;
      return {
        emi,
        totalPayment: emi * tenureValue,
        totalInterest: 0,
      };
    }

    const growth = Math.pow(1 + monthlyRate, tenureValue);
    const emi = (principalValue * monthlyRate * growth) / (growth - 1);

    return {
      emi,
      totalPayment: emi * tenureValue,
      totalInterest: emi * tenureValue - principalValue,
    };
  }, [principal, annualRate, tenureMonths]);

  const interestResult = useMemo(() => {
    const principalValue = Number.parseFloat(interestPrincipal);
    const annualRateValue = Number.parseFloat(interestRate);
    const tenureValue = Number.parseFloat(interestTenureMonths);

    if (
      Number.isNaN(principalValue) ||
      Number.isNaN(annualRateValue) ||
      Number.isNaN(tenureValue) ||
      principalValue <= 0 ||
      annualRateValue < 0 ||
      tenureValue <= 0
    ) {
      return null;
    }

    const totalInterest = (principalValue * annualRateValue * tenureValue) / 1200;

    return {
      totalInterest,
      totalPayable: principalValue + totalInterest,
    };
  }, [interestPrincipal, interestRate, interestTenureMonths]);

  const showEmiCalculator = mode === "both" || mode === "emi";
  const showInterestCalculator = mode === "both" || mode === "interest";

  return (
    <section
      className={
        showEmiCalculator && showInterestCalculator
          ? "grid gap-6 lg:grid-cols-2 lg:gap-8"
          : "grid"
      }
    >
      {showEmiCalculator ? (
        <article className=" bg-white p-5 sm:p-6">
          <h3 className="text-[18px] font-semibold text-[#123451]">EMI Calculator</h3>
          <p className="mt-2 text-[16px] leading-6 text-slate-600">
            Calculate monthly installment based on principal, annual rate, and tenure.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Principal (NPR)</span>
              <input
                type="number"
                value={principal}
                onChange={(event) => setPrincipal(event.target.value)}
                className="w-full  border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Annual Interest Rate (%)</span>
              <input
                type="number"
                step="0.01"
                value={annualRate}
                onChange={(event) => setAnnualRate(event.target.value)}
                className="w-full border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Tenure (months)</span>
              <input
                type="number"
                value={tenureMonths}
                onChange={(event) => setTenureMonths(event.target.value)}
                className="w-full border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
              />
            </label>
          </div>

          <div className="mt-6 border border-[#d9eaf0] bg-[#f6fcfd] p-4">
            {emiResult ? (
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  Monthly EMI: <span className="font-semibold text-[#123451]">{formatNpr(emiResult.emi)}</span>
                </p>
                <p>
                  Total Interest: <span className="font-semibold text-[#123451]">{formatNpr(emiResult.totalInterest)}</span>
                </p>
                <p>
                  Total Payment: <span className="font-semibold text-[#123451]">{formatNpr(emiResult.totalPayment)}</span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">Please enter valid values to calculate EMI.</p>
            )}
          </div>
        </article>
      ) : null}

      {showInterestCalculator ? (
        <article className="p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-[#123451]">Loan Interest Calculator</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Estimate total interest payable using simple interest for selected tenure.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Principal (NPR)</span>
              <input
                type="number"
                value={interestPrincipal}
                onChange={(event) => setInterestPrincipal(event.target.value)}
                className="w-full  border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Annual Interest Rate (%)</span>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(event) => setInterestRate(event.target.value)}
                className="w-full border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Tenure (months)</span>
              <input
                type="number"
                value={interestTenureMonths}
                onChange={(event) => setInterestTenureMonths(event.target.value)}
                className="w-full border border-[#c9dce5] px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#0d837f] focus:ring-2 focus:ring-[#0d837f]/20"
              />
            </label>
          </div>

          <div className="mt-6 border border-[#d9eaf0] bg-[#f6fcfd] p-4">
            {interestResult ? (
              <div className="space-y-2 text-sm text-slate-700">
                <p>
                  Total Interest Payable:{" "}
                  <span className="font-semibold text-[#123451]">
                    {formatNpr(interestResult.totalInterest)}
                  </span>
                </p>
                <p>
                  Total Amount Payable:{" "}
                  <span className="font-semibold text-[#123451]">
                    {formatNpr(interestResult.totalPayable)}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                Please enter valid values to calculate total interest.
              </p>
            )}
          </div>
        </article>
      ) : null}
    </section>
  );
}
