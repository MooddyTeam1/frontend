import React from "react";

type ProgressBarProps = {
  value: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className="h-1 w-full rounded-full bg-neutral-200">
    <div
      className="h-1 rounded-full bg-neutral-900 transition-[width] duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
);
