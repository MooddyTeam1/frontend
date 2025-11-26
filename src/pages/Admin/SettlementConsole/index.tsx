// 한글 설명: Admin용 정산 콘솔 페이지. 메이커 정산 관리 및 지급 처리 기능 제공
import React, { useEffect, useState } from "react";
import { currencyKRW } from "../../../shared/utils/format";
import {
  fetchAdminSettlementSummary,
  fetchAdminSettlementList,
  fetchAdminSettlementDetail,
  createSettlement,
  processFirstPayout,
  processFinalReady,
  processFinalPayout,
} from "../../../features/admin/api/adminSettlementService";
import type {
  SettlementSummaryResponse,
  SettlementListItemResponse,
  SettlementResponse,
  SettlementStatus,
  FirstPaymentStatus,
  FinalPaymentStatus,
} from "../../../features/admin/types";

// 한글 설명: 정산 콘솔 메인 컴포넌트
export const SettlementConsolePage: React.FC = () => {
  // 한글 설명: 요약 데이터 상태
  const [summary, setSummary] = useState<SettlementSummaryResponse | null>(
    null
  );
  const [summaryLoading, setSummaryLoading] = useState(false);

  // 한글 설명: 목록 데이터 상태
  const [listData, setListData] = useState<SettlementListItemResponse[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 한글 설명: 상세 데이터 상태
  const [selectedSettlement, setSelectedSettlement] =
    useState<SettlementResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 한글 설명: 액션 처리 상태
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionProjectId, setActionProjectId] = useState<number | null>(null);

  // 한글 설명: 요약 데이터 조회
  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const data = await fetchAdminSettlementSummary();
      setSummary(data);
    } catch (error) {
      console.error("정산 요약 조회 실패:", error);
      alert("정산 요약을 불러오지 못했습니다.");
    } finally {
      setSummaryLoading(false);
    }
  };

  // 한글 설명: 목록 데이터 조회
  const loadList = async (page: number = 0) => {
    setListLoading(true);
    try {
      const data = await fetchAdminSettlementList(page, pageSize);
      setListData(data.content);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("정산 목록 조회 실패:", error);
      alert("정산 목록을 불러오지 못했습니다.");
    } finally {
      setListLoading(false);
    }
  };

  // 한글 설명: 상세 데이터 조회
  const loadDetail = async (settlementId: number) => {
    setDetailLoading(true);
    try {
      const data = await fetchAdminSettlementDetail(settlementId);
      setSelectedSettlement(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error("정산 상세 조회 실패:", error);
      alert("정산 상세 정보를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  // 한글 설명: 정산 생성
  const handleCreateSettlement = async (projectId: number) => {
    if (!confirm(`프로젝트 ID ${projectId}에 대한 정산을 생성하시겠습니까?`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await createSettlement(projectId);
      alert("정산이 생성되었습니다.");
      await loadList(currentPage);
      await loadSummary();
    } catch (error) {
      console.error("정산 생성 실패:", error);
      alert("정산 생성에 실패했습니다.");
    } finally {
      setIsProcessing(false);
      setActionProjectId(null);
    }
  };

  // 한글 설명: 선지급 처리
  const handleFirstPayout = async (settlementId: number) => {
    if (!confirm("선지급을 처리하시겠습니까?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await processFirstPayout(settlementId);
      alert("선지급이 처리되었습니다.");
      await loadList(currentPage);
      await loadSummary();
      if (selectedSettlement?.settlementId === settlementId) {
        await loadDetail(settlementId);
      }
    } catch (error) {
      console.error("선지급 처리 실패:", error);
      alert("선지급 처리에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 한글 설명: 잔금 준비 완료 처리
  const handleFinalReady = async (settlementId: number) => {
    if (!confirm("잔금 준비를 완료하시겠습니까?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await processFinalReady(settlementId);
      alert("잔금 준비가 완료되었습니다.");
      await loadList(currentPage);
      await loadSummary();
      if (selectedSettlement?.settlementId === settlementId) {
        await loadDetail(settlementId);
      }
    } catch (error) {
      console.error("잔금 준비 완료 처리 실패:", error);
      alert("잔금 준비 완료 처리에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 한글 설명: 잔금 지급 처리
  const handleFinalPayout = async (settlementId: number) => {
    if (!confirm("잔금 지급을 처리하시겠습니까?")) {
      return;
    }

    setIsProcessing(true);
    try {
      await processFinalPayout(settlementId);
      alert("잔금 지급이 처리되었습니다.");
      await loadList(currentPage);
      await loadSummary();
      if (selectedSettlement?.settlementId === settlementId) {
        await loadDetail(settlementId);
      }
    } catch (error) {
      console.error("잔금 지급 처리 실패:", error);
      alert("잔금 지급 처리에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 한글 설명: 초기 로드
  useEffect(() => {
    loadSummary();
    loadList(0);
  }, []);

  return (
    <div className="w-full">
      <div className="mx-auto min-h-[70vh] max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                정산 콘솔
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                메이커 정산 관리 및 지급 처리를 할 수 있습니다
              </p>
            </div>
            {/* 한글 설명: 정산 생성 버튼 (프로젝트 ID 입력) */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="프로젝트 ID"
                value={actionProjectId || ""}
                onChange={(e) =>
                  setActionProjectId(
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                className="w-32 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-900 focus:outline-none"
                disabled={isProcessing}
              />
              <button
                onClick={() =>
                  actionProjectId && handleCreateSettlement(actionProjectId)
                }
                disabled={!actionProjectId || isProcessing}
                className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "처리 중..." : "정산 생성"}
              </button>
            </div>
          </div>

          {/* 요약 카드 */}
          {summaryLoading ? (
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200"></div>
                  <div className="mt-2 h-6 w-32 animate-pulse rounded bg-neutral-200"></div>
                </div>
              ))}
            </div>
          ) : summary ? (
            <div className="grid grid-cols-4 gap-4">
              {/* 정산 대기 */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs text-neutral-500">정산 대기</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">
                  {summary.pendingCount}건
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {currencyKRW(summary.pendingAmount)}
                </div>
              </div>

              {/* 선지급 완료 */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs text-neutral-500">선지급 완료</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">
                  {summary.firstPaidCount}건
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {currencyKRW(summary.firstPaidAmount)}
                </div>
              </div>

              {/* 잔금 준비 완료 */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs text-neutral-500">잔금 준비 완료</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">
                  {summary.finalReadyCount}건
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {currencyKRW(summary.finalReadyAmount)}
                </div>
              </div>

              {/* 정산 완료 */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="text-xs text-neutral-500">정산 완료</div>
                <div className="mt-1 text-lg font-semibold text-neutral-900">
                  {summary.completedCount}건
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  {currencyKRW(summary.completedAmount)}
                </div>
              </div>
            </div>
          ) : null}

          {/* 목록 테이블 */}
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-200 bg-neutral-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      정산ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      프로젝트
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      메이커
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      상태
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      총 주문액
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      정산액
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      선지급
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      잔금
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white">
                  {listLoading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-sm text-neutral-500"
                      >
                        불러오는 중...
                      </td>
                    </tr>
                  ) : listData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-8 text-center text-sm text-neutral-500"
                      >
                        정산 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    listData.map((item) => (
                      <tr
                        key={item.settlementId}
                        className="hover:bg-neutral-50 cursor-pointer"
                        onClick={() => loadDetail(item.settlementId)}
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-neutral-900">
                          {item.settlementId}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.projectTitle}
                            </span>
                            <span className="text-xs text-neutral-500">
                              프로젝트 ID: {item.projectId}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          <div className="flex flex-col">
                            <span>{item.makerName}</span>
                            <span className="text-xs text-neutral-500">
                              메이커 ID: {item.makerId}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-col gap-1">
                            <StatusBadge status={item.status} />
                            <div className="text-xs text-neutral-500">
                              선지급:{" "}
                              <PaymentStatusBadge
                                status={item.firstPaymentStatus}
                              />
                            </div>
                            <div className="text-xs text-neutral-500">
                              잔금:{" "}
                              <PaymentStatusBadge
                                status={item.finalPaymentStatus}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-neutral-900">
                          {currencyKRW(item.totalOrderAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-neutral-900">
                          {currencyKRW(item.netAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-neutral-600">
                          {currencyKRW(item.firstPaymentAmount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-neutral-600">
                          {currencyKRW(item.finalPaymentAmount)}
                        </td>
                        <td
                          className="whitespace-nowrap px-4 py-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-2">
                            <button
                              onClick={() => loadDetail(item.settlementId)}
                              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                            >
                              상세
                            </button>
                            {item.status === "PENDING" &&
                              item.firstPaymentStatus === "PENDING" && (
                                <button
                                  onClick={() =>
                                    handleFirstPayout(item.settlementId)
                                  }
                                  disabled={isProcessing}
                                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition hover:border-blue-900 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  선지급
                                </button>
                              )}
                            {item.status === "FIRST_PAID" &&
                              item.finalPaymentStatus === "PENDING" && (
                                <button
                                  onClick={() =>
                                    handleFinalReady(item.settlementId)
                                  }
                                  disabled={isProcessing}
                                  className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition hover:border-amber-900 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  잔금 준비
                                </button>
                              )}
                            {item.status === "FIRST_PAID" &&
                              item.finalPaymentStatus === "READY" && (
                                <button
                                  onClick={() =>
                                    handleFinalPayout(item.settlementId)
                                  }
                                  disabled={isProcessing}
                                  className="rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1 text-xs font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  잔금 지급
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    전체 {totalElements}건 중 {currentPage * pageSize + 1}-
                    {Math.min((currentPage + 1) * pageSize, totalElements)}건
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadList(currentPage - 1)}
                      disabled={currentPage === 0 || listLoading}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      이전
                    </button>
                    <span className="flex items-center px-3 text-sm text-neutral-600">
                      {currentPage + 1} / {totalPages}
                    </span>
                    <button
                      onClick={() => loadList(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1 || listLoading}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      다음
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      {showDetailModal && selectedSettlement && (
        <SettlementDetailModal
          settlement={selectedSettlement}
          loading={detailLoading}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSettlement(null);
          }}
          onFirstPayout={handleFirstPayout}
          onFinalReady={handleFinalReady}
          onFinalPayout={handleFinalPayout}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
};

// 한글 설명: 정산 상세 모달 컴포넌트
interface SettlementDetailModalProps {
  settlement: SettlementResponse;
  loading: boolean;
  onClose: () => void;
  onFirstPayout: (settlementId: number) => void;
  onFinalReady: (settlementId: number) => void;
  onFinalPayout: (settlementId: number) => void;
  isProcessing: boolean;
}

const SettlementDetailModal: React.FC<SettlementDetailModalProps> = ({
  settlement,
  loading,
  onClose,
  onFirstPayout,
  onFinalReady,
  onFinalPayout,
  isProcessing,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-900">
            정산 상세 정보
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 transition hover:text-neutral-900"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-neutral-500">
            불러오는 중...
          </div>
        ) : (
          <div className="space-y-4">
            {/* 기본 정보 */}
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div>
                <div className="text-xs text-neutral-500">정산 ID</div>
                <div className="mt-1 font-mono text-sm font-medium text-neutral-900">
                  {settlement.settlementId}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">상태</div>
                <div className="mt-1">
                  <StatusBadge status={settlement.status} />
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">프로젝트</div>
                <div className="mt-1 text-sm font-medium text-neutral-900">
                  {settlement.projectTitle}
                </div>
                <div className="text-xs text-neutral-500">
                  프로젝트 ID: {settlement.projectId}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-500">메이커</div>
                <div className="mt-1 text-sm font-medium text-neutral-900">
                  {settlement.makerName}
                </div>
                <div className="text-xs text-neutral-500">
                  메이커 ID: {settlement.makerId}
                </div>
              </div>
            </div>

            {/* 금액 정보 */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                금액 정보
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">총 주문 금액</span>
                  <span className="font-medium text-neutral-900">
                    {currencyKRW(settlement.totalOrderAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">토스 수수료</span>
                  <span className="text-neutral-600">
                    -{currencyKRW(settlement.tossFeeAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">플랫폼 수수료</span>
                  <span className="text-neutral-600">
                    -{currencyKRW(settlement.platformFeeAmount)}
                  </span>
                </div>
                <div className="border-t border-neutral-200 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-neutral-900">
                      정산액 (순수익)
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {currencyKRW(settlement.netAmount)}
                    </span>
                  </div>
                </div>
                <div className="mt-3 space-y-1 border-t border-neutral-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">선지급 금액</span>
                    <span className="font-medium text-neutral-900">
                      {currencyKRW(settlement.firstPaymentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">잔금 지급 금액</span>
                    <span className="font-medium text-neutral-900">
                      {currencyKRW(settlement.finalPaymentAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 지급 상태 */}
            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                지급 상태
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">선지급 상태</span>
                  <PaymentStatusBadge status={settlement.firstPaymentStatus} />
                </div>
                {settlement.firstPaymentAt && (
                  <div className="text-xs text-neutral-500">
                    선지급 시각:{" "}
                    {new Date(settlement.firstPaymentAt).toLocaleString(
                      "ko-KR"
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">잔금 지급 상태</span>
                  <PaymentStatusBadge status={settlement.finalPaymentStatus} />
                </div>
                {settlement.finalPaymentAt && (
                  <div className="text-xs text-neutral-500">
                    잔금 지급 시각:{" "}
                    {new Date(settlement.finalPaymentAt).toLocaleString(
                      "ko-KR"
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">재시도 횟수</span>
                  <span className="text-neutral-900">
                    {settlement.retryCount}회
                  </span>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-2 border-t border-neutral-200 pt-4">
              <button
                onClick={onClose}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                닫기
              </button>
              {settlement.status === "PENDING" &&
                settlement.firstPaymentStatus === "PENDING" && (
                  <button
                    onClick={() => onFirstPayout(settlement.settlementId)}
                    disabled={isProcessing}
                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:border-blue-900 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    선지급 처리
                  </button>
                )}
              {settlement.status === "FIRST_PAID" &&
                settlement.finalPaymentStatus === "PENDING" && (
                  <button
                    onClick={() => onFinalReady(settlement.settlementId)}
                    disabled={isProcessing}
                    className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:border-amber-900 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    잔금 준비 완료
                  </button>
                )}
              {settlement.status === "FIRST_PAID" &&
                settlement.finalPaymentStatus === "READY" && (
                  <button
                    onClick={() => onFinalPayout(settlement.settlementId)}
                    disabled={isProcessing}
                    className="rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    잔금 지급 처리
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 한글 설명: 정산 상태 배지 컴포넌트
const StatusBadge: React.FC<{ status: SettlementStatus }> = ({ status }) => {
  const map: Record<
    SettlementStatus,
    { label: string; className: string }
  > = {
    PENDING: {
      label: "정산 대기",
      className: "border-neutral-200 bg-neutral-50 text-neutral-700",
    },
    FIRST_PAID: {
      label: "선지급 완료",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    FINAL_READY: {
      label: "잔금 준비 완료",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    COMPLETED: {
      label: "정산 완료",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  };
  const { label, className } = map[status];
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};

// 한글 설명: 지급 상태 배지 컴포넌트
const PaymentStatusBadge: React.FC<{
  status: FirstPaymentStatus | FinalPaymentStatus;
}> = ({ status }) => {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: "대기",
      className: "border-neutral-200 bg-neutral-50 text-neutral-700",
    },
    READY: {
      label: "준비 완료",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    DONE: {
      label: "완료",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  };
  const { label, className } = map[status] || map.PENDING;
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};
