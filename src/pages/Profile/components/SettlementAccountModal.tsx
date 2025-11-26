// 한글 설명: 정산 계좌 입력/수정 모달 컴포넌트
import React, { useState, useEffect } from "react";
import { makerService } from "../../../features/maker/api/makerService";
import type {
  MakerSettlementProfileDTO,
  MakerSettlementProfileUpdateRequest,
} from "../../../features/maker/types";

type SettlementAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // 한글 설명: 저장 성공 시 콜백
};

// 한글 설명: 정산 계좌 입력/수정 모달 컴포넌트
export const SettlementAccountModal: React.FC<SettlementAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  // 한글 설명: 폼 입력 상태
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // 한글 설명: 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 모달이 열릴 때 기존 정산 계좌 정보를 불러온다
  useEffect(() => {
    if (isOpen) {
      loadSettlementProfile();
    }
  }, [isOpen]);

  // 한글 설명: 정산 계좌 정보 조회
  const loadSettlementProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await makerService.getSettlementProfile();
      if (profile) {
        setBankName(profile.bankName || "");
        setAccountNumber(profile.accountNumber || "");
        setAccountHolder(profile.accountHolder || "");
      } else {
        // 한글 설명: 정산 계좌 정보가 없으면 빈 폼으로 초기화
        setBankName("");
        setAccountNumber("");
        setAccountHolder("");
      }
    } catch (err) {
      console.error("정산 계좌 정보 조회 실패", err);
      setError(
        err instanceof Error
          ? err.message
          : "정산 계좌 정보를 불러오지 못했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 한글 설명: 정산 계좌 정보 저장
  const handleSave = async () => {
    // 한글 설명: 필수 필드 검증
    if (!bankName.trim()) {
      setError("은행명을 입력해주세요.");
      return;
    }
    if (!accountNumber.trim()) {
      setError("계좌번호를 입력해주세요.");
      return;
    }
    if (!accountHolder.trim()) {
      setError("예금주를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateRequest: MakerSettlementProfileUpdateRequest = {
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim(),
      };

      await makerService.updateSettlementProfile(updateRequest);

      // 한글 설명: 저장 성공 시 콜백 호출 및 모달 닫기
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error("정산 계좌 정보 저장 실패", err);
      setError(
        err instanceof Error
          ? err.message
          : "정산 계좌 정보를 저장하지 못했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  // 한글 설명: 모달이 열려있지 않으면 렌더링하지 않음
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 한글 설명: 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">
              정산 계좌 정보
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 한글 설명: 에러 메시지 */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 한글 설명: 폼 영역 */}
          {loading ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              정산 계좌 정보를 불러오는 중...
            </div>
          ) : (
            <div className="space-y-4">
              {/* 한글 설명: 은행명 입력 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  은행명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="예: 국민은행, 신한은행"
                  maxLength={50}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  disabled={saving}
                />
              </div>

              {/* 한글 설명: 계좌번호 입력 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  계좌번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => {
                    // 한글 설명: 숫자와 하이픈만 입력 허용
                    const value = e.target.value.replace(/[^0-9-]/g, "");
                    setAccountNumber(value);
                  }}
                  placeholder="예: 123-456-789012"
                  maxLength={50}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-mono focus:border-neutral-900 focus:outline-none"
                  disabled={saving}
                />
              </div>

              {/* 한글 설명: 예금주 입력 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  예금주 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="예금주 이름을 입력하세요"
                  maxLength={100}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-900 focus:outline-none"
                  disabled={saving}
                />
              </div>

              {/* 한글 설명: 안내 메시지 */}
              <div className="rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600">
                <p>
                  정산 계좌 정보는 프로젝트 성공 시 정산 금액을 받을 계좌입니다.
                </p>
                <p className="mt-1">
                  정확한 정보를 입력해주세요. 입력한 정보는 안전하게 보관됩니다.
                </p>
              </div>

              {/* 한글 설명: 버튼 영역 */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "저장 중..." : "저장"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

