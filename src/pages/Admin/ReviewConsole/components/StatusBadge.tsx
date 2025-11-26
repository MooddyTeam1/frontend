// 한글 설명: 상태 뱃지 컴포넌트
import React from "react";
import { statusLabelMap } from "../../../../shared/constants/projectStatus";

interface StatusBadgeProps {
  kind: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ kind }) => {
  const map: Record<string, string> = {
    REVIEW: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-rose-100 text-rose-800",
    DRAFT: "bg-slate-100 text-slate-800",
    SCHEDULED: "bg-indigo-100 text-indigo-800",
    LIVE: "bg-blue-100 text-blue-800",
    ENDED: "bg-zinc-100 text-zinc-800",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${
        map[kind] ?? "bg-neutral-100 text-neutral-800"
      }`}
    >
      {statusLabelMap[kind] ?? kind}
    </span>
  );
};

