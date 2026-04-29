import React from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
};

export function SectionHeading({
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mb-7 sm:mb-8">
  
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-[#123451] text-[20px] ">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-3xl text-[16px] leading-7 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
}
