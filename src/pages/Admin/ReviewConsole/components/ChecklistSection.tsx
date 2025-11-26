// 한글 설명: 체크리스트 섹션 컴포넌트
import React from "react";

interface ChecklistSectionProps {
  items: string[];
  checks: boolean[];
  onToggle: (index: number) => void;
  saveChecklist: boolean;
  onSaveChecklistChange: (value: boolean) => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  items,
  checks,
  onToggle,
  saveChecklist,
  onSaveChecklistChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-neutral-900">체크리스트</div>
      <div className="space-y-2 text-sm">
        {items.map((label, idx) => (
          <label
            key={idx}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checks[idx]}
              onChange={() => onToggle(idx)}
              className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-neutral-700">{label}</span>
          </label>
        ))}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-neutral-500">체크리스트 결과 저장</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSaveChecklistChange(!saveChecklist)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                saveChecklist ? "bg-blue-600" : "bg-neutral-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  saveChecklist ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-xs text-neutral-500">
              {saveChecklist ? "켜짐" : "꺼짐"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

