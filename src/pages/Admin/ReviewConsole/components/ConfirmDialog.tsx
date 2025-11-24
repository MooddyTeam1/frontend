// 한글 설명: 승인/반려 확인 다이얼로그 컴포넌트
import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  type: "approve" | "reject" | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  type,
  onOpenChange,
  onConfirm,
}) => {
  if (!open || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">
          {type === "approve" ? "승인 처리" : "반려 처리"}
        </h2>
        <p className="text-sm text-neutral-500">
          {type === "approve" ? (
            <>해당 프로젝트를 <b>승인</b>합니다. 계속할까요?</>
          ) : (
            <>반려 사유를 기록하고 <b>반려</b>합니다. 계속할까요?</>
          )}
        </p>
        <div className="flex justify-end gap-2 text-sm">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full border border-neutral-200 px-4 py-2 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            취소
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={`rounded-full border px-4 py-2 text-white ${
              type === "approve"
                ? "border-green-200 bg-green-600 hover:bg-green-700"
                : "border-red-200 bg-red-600 hover:bg-red-700"
            }`}
          >
            계속
          </button>
        </div>
      </div>
    </div>
  );
};

