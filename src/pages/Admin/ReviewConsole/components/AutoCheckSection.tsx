// 한글 설명: 자동 점검 결과 섹션 컴포넌트
import React from "react";

interface AutoCheckSectionProps {
  issues: string[];
}

export const AutoCheckSection: React.FC<AutoCheckSectionProps> = ({
  issues,
}) => {
  if (issues.length === 0) {
    return (
      <div className="mb-3">
        <div className="text-sm font-semibold text-neutral-900">자동 점검</div>
        <div className="text-xs text-emerald-600 mt-1">문제 없음</div>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <div className="text-sm font-semibold text-neutral-900">자동 점검</div>
      <ul className="list-disc pl-5 text-xs text-rose-600 mt-1">
        {issues.map((issue, i) => (
          <li key={i}>{issue}</li>
        ))}
      </ul>
    </div>
  );
};

