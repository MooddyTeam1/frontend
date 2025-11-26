// 한글 설명: 반려 사유 섹션 컴포넌트
import React, { useRef, useEffect } from "react";

interface RejectReasonSectionProps {
  presets: readonly string[];
  selectedPreset: string;
  onPresetChange: (preset: string) => void;
  reasonText: string;
  onReasonTextChange: (text: string) => void;
  highlight?: boolean;
  onPresetOpenChange?: (open: boolean) => void;
}

export const RejectReasonSection: React.FC<RejectReasonSectionProps> = ({
  presets,
  selectedPreset,
  onPresetChange,
  reasonText,
  onReasonTextChange,
  highlight = false,
  onPresetOpenChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 한글 설명: presetOpen은 현재 미사용
  // const [presetOpen, setPresetOpen] = React.useState(false);

  const handlePresetChange = (value: string) => {
    onPresetChange(value);
    onReasonTextChange(value);
    if (onPresetOpenChange) {
      onPresetOpenChange(false);
    }
  };

  useEffect(() => {
    if (highlight && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 250);
    }
  }, [highlight]);

  return (
    <>
      <div className="text-sm text-neutral-500 mb-1 mt-4">반려 사유 프리셋</div>
      <div className="grid grid-cols-3 gap-3 items-start">
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="col-span-1 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
        >
          <option value="">사유 선택</option>
          {presets.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="col-span-2 self-center text-xs text-neutral-500">
          프리셋을 선택하면 아래 메모에 자동으로 들어갑니다. 자유롭게 수정하세요.
        </div>
      </div>
      <div className="text-sm text-neutral-500 mt-3 mb-1">운영 메모</div>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={reasonText}
          onChange={(e) => onReasonTextChange(e.target.value)}
          placeholder="심사 사유/보완 요청 메모를 남겨주세요."
          className={`min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm focus:border-neutral-900 focus:outline-none transition ${
            highlight ? "ring-2 ring-amber-300" : ""
          }`}
        />
      </div>
    </>
  );
};

