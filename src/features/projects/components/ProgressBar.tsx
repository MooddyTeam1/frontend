import React from "react";

type ProgressBarProps = {
  value: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => (
  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
    <div
      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-[width] duration-500 shadow-sm"
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
);
