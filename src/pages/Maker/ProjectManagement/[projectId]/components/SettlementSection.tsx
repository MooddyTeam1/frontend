// 한글 설명: 정산/정책 관련 섹션
import React from "react";
import type { SettlementInfoDTO } from "../../../../../features/maker/projectManagement/types";
import { currencyKRW } from "../../../../../shared/utils/format";

type SettlementSectionProps = {
  settlement: SettlementInfoDTO;
};

export const SettlementSection: React.FC<SettlementSectionProps> = ({
  settlement,
}) => {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        정산 정보
      </h2>

      <div className="space-y-4">
        {/* 한글 설명: 예상 정산 금액 */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">총 모금액</span>
              <span className="font-semibold text-neutral-900">
                {currencyKRW(settlement.totalRaised)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">수수료</span>
              <span className="text-neutral-700">
                -{currencyKRW(settlement.platformFee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">PG비</span>
              <span className="text-neutral-700">
                -{currencyKRW(settlement.pgFee)}
              </span>
            </div>
            {settlement.otherFees > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">기타 비용</span>
                <span className="text-neutral-700">
                  -{currencyKRW(settlement.otherFees)}
                </span>
              </div>
            )}
            <div className="border-t border-neutral-200 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">
                  최종 정산 예상액
                </span>
                <span className="text-lg font-bold text-green-600">
                  {currencyKRW(settlement.finalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 한글 설명: 정산 일정 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">결제 확정일</span>
            <span className="text-neutral-700">
              {settlement.paymentConfirmedAt
                ? new Date(settlement.paymentConfirmedAt).toLocaleDateString(
                    "ko-KR"
                  )
                : "미확정"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">정산 예정일</span>
            <span className="text-neutral-700">
              {settlement.settlementScheduledAt
                ? new Date(
                    settlement.settlementScheduledAt
                  ).toLocaleDateString("ko-KR")
                : "미정"}
            </span>
          </div>
        </div>

        {/* 한글 설명: 정산 계좌 정보 */}
        {settlement.bankName && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <p className="mb-2 text-xs font-medium text-neutral-500">
              정산 계좌
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">은행</span>
                <span className="text-neutral-700">{settlement.bankName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">계좌번호</span>
                <span className="font-mono text-neutral-700">
                  {settlement.accountNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">예금주</span>
                <span className="text-neutral-700">
                  {settlement.accountHolder}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 한글 설명: 세금/증빙 관련 안내 */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="mb-2 text-xs font-semibold text-blue-900">
            세금/증빙 관련 안내
          </p>
          <p className="text-xs text-blue-700">
            정산 시 필요한 서류는 정산 예정일 7일 전까지 제출해주세요.
            <br />
            사업자 정보는 설정 페이지에서 확인 및 수정할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

