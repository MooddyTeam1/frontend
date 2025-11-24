// 한글 설명: 배송 관리 콘솔 컴포넌트
import React, { useState, useEffect, useMemo } from "react";
import { currencyKRW } from "../../../../../shared/utils/format";
import {
  fetchShipments,
  fetchShipmentSummary,
  updateShipmentStatus,
  bulkUpdateShipmentStatus,
  updateTrackingInfo,
  bulkUploadTracking,
  updateShipmentMemo,
  exportShipments,
} from "../../../../../features/maker/projectManagement/api/shipmentService";
import type {
  ShipmentDTO,
  ShipmentFilter,
  ShipmentSummaryDTO,
  ShipmentStatus,
} from "../../../../../features/maker/projectManagement/types/shipment";
import {
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_COLORS,
} from "../../../../../features/maker/projectManagement/types/shipment";
import { ShipmentDetailModal } from "./ShipmentDetailModal";
import { BulkTrackingUploadModal } from "./BulkTrackingUploadModal";
import {
  mockShipments,
  mockShipmentSummary,
} from "../../../../../features/maker/projectManagement/mockData/shipmentMockData";

// 한글 설명: Mock API 사용 여부 (개발 중 확인용)
const USE_MOCK_DATA = true;

type ShipmentConsoleProps = {
  projectId: number;
  rewards: Array<{ id: number; title: string }>; // 한글 설명: 리워드 목록 (필터용)
};

export const ShipmentConsole: React.FC<ShipmentConsoleProps> = ({
  projectId,
  rewards,
}) => {
  // 한글 설명: 상태 관리
  const [shipments, setShipments] = useState<ShipmentDTO[]>([]);
  const [summary, setSummary] = useState<ShipmentSummaryDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDTO | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // 한글 설명: 필터 상태
  const [filter, setFilter] = useState<ShipmentFilter>({
    status: "ALL",
    page: 1,
    pageSize: 50,
    sortBy: "orderDate",
    sortOrder: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // 한글 설명: 배송 목록 및 요약 조회
  const loadShipments = async () => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        // 한글 설명: Mock 데이터 사용
        await new Promise((resolve) => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        
        // 한글 설명: 필터 적용
        let filteredShipments = [...mockShipments];
        
        if (filter.status && filter.status !== "ALL") {
          filteredShipments = filteredShipments.filter(
            (s) => s.shipmentStatus === filter.status
          );
        }
        
        if (filter.rewardId) {
          filteredShipments = filteredShipments.filter(
            (s) => s.reward.id === filter.rewardId
          );
        }
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredShipments = filteredShipments.filter(
            (s) =>
              s.orderCode.toLowerCase().includes(query) ||
              s.supporterName.toLowerCase().includes(query) ||
              (s.supporterPhone && s.supporterPhone.includes(query)) ||
              s.address.fullAddress.toLowerCase().includes(query)
          );
        }
        
        setShipments(filteredShipments);
        setSummary(mockShipmentSummary);
      } else {
        // 한글 설명: 실제 API 호출
        const [listResponse, summaryData] = await Promise.all([
          fetchShipments(projectId, {
            ...filter,
            search: searchQuery || undefined,
          }),
          fetchShipmentSummary(projectId),
        ]);
        setShipments(listResponse.shipments);
        setSummary(summaryData);
      }
    } catch (error) {
      console.error("배송 목록 조회 실패", error);
      alert("배송 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [projectId, filter.status, filter.rewardId, filter.sortBy, filter.sortOrder, filter.page]);

  // 한글 설명: 검색어 변경 시 debounce 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== filter.search) {
        setFilter((prev) => ({ ...prev, search: searchQuery, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 한글 설명: 개별 배송 상태 변경
  const handleStatusChange = async (
    shipmentId: number,
    status: ShipmentStatus,
    issueReason?: string
  ) => {
    try {
      await updateShipmentStatus(projectId, shipmentId, {
        status,
        issueReason: status === "ISSUE" ? issueReason : null,
      });
      await loadShipments();
    } catch (error) {
      console.error("배송 상태 변경 실패", error);
      alert("배송 상태 변경에 실패했습니다.");
    }
  };

  // 한글 설명: 일괄 배송 상태 변경
  const handleBulkStatusChange = async (
    status: ShipmentStatus,
    issueReason?: string
  ) => {
    if (selectedIds.size === 0) {
      alert("선택된 배송이 없습니다.");
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedIds.size}건의 배송 상태를 "${SHIPMENT_STATUS_LABELS[status]}"로 변경하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      await bulkUpdateShipmentStatus(projectId, {
        shipmentIds: Array.from(selectedIds),
        status,
        issueReason: status === "ISSUE" ? issueReason : null,
      });
      setSelectedIds(new Set());
      await loadShipments();
      alert("배송 상태가 일괄 변경되었습니다.");
    } catch (error) {
      console.error("일괄 배송 상태 변경 실패", error);
      alert("일괄 배송 상태 변경에 실패했습니다.");
    }
  };

  // 한글 설명: 송장 정보 업데이트
  const handleTrackingUpdate = async (
    shipmentId: number,
    courierName: string,
    trackingNumber: string
  ) => {
    try {
      await updateTrackingInfo(projectId, shipmentId, {
        courierName,
        trackingNumber,
      });
      await loadShipments();
    } catch (error) {
      console.error("송장 정보 업데이트 실패", error);
      alert("송장 정보 업데이트에 실패했습니다.");
    }
  };

  // 한글 설명: 배송 메모 업데이트
  const handleMemoUpdate = async (shipmentId: number, memo: string) => {
    try {
      await updateShipmentMemo(projectId, shipmentId, { memo });
      await loadShipments();
    } catch (error) {
      console.error("배송 메모 업데이트 실패", error);
      alert("배송 메모 업데이트에 실패했습니다.");
    }
  };

  // 한글 설명: 엑셀 다운로드
  const handleExport = async (format: "csv" | "xlsx" = "xlsx") => {
    try {
      const blob = await exportShipments(projectId, {
        ...filter,
        search: searchQuery || undefined,
      }, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `배송목록_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("엑셀 다운로드 실패", error);
      alert("엑셀 다운로드에 실패했습니다.");
    }
  };

  // 한글 설명: 체크박스 토글
  const toggleSelection = (shipmentId: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(shipmentId)) {
      newSelected.delete(shipmentId);
    } else {
      newSelected.add(shipmentId);
    }
    setSelectedIds(newSelected);
  };

  // 한글 설명: 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedIds.size === shipments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(shipments.map((s) => s.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* 한글 설명: 배송 요약 카드 */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">총 주문 수</div>
            <div className="mt-1 text-lg font-semibold text-neutral-900">
              {summary.totalOrders.toLocaleString()}건
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">배송 준비 중</div>
            <div className="mt-1 text-lg font-semibold text-yellow-700">
              {summary.readyCount.toLocaleString()}건
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">배송 중</div>
            <div className="mt-1 text-lg font-semibold text-blue-700">
              {summary.shippedCount.toLocaleString()}건
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">배송 완료</div>
            <div className="mt-1 text-lg font-semibold text-green-700">
              {summary.deliveredCount.toLocaleString()}건
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs text-neutral-500">배송 문제</div>
            <div className="mt-1 text-lg font-semibold text-red-700">
              {summary.issueCount.toLocaleString()}건
            </div>
          </div>
        </div>
      )}

      {/* 한글 설명: 필터 및 액션 바 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* 한글 설명: 배송 상태 필터 */}
          <select
            value={filter.status || "ALL"}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                status: e.target.value as ShipmentStatus | "ALL",
                page: 1,
              }))
            }
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="ALL">전체 상태</option>
            {Object.entries(SHIPMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {/* 한글 설명: 리워드 필터 */}
          <select
            value={filter.rewardId || ""}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                rewardId: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              }))
            }
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm"
          >
            <option value="">전체 리워드</option>
            {rewards.map((reward) => (
              <option key={reward.id} value={reward.id}>
                {reward.title}
              </option>
            ))}
          </select>

          {/* 한글 설명: 검색 */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문번호, 이름, 연락처, 주소 검색"
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm min-w-[200px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 한글 설명: 일괄 작업 버튼 */}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">
                {selectedIds.size}건 선택됨
              </span>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("SHIPPED")}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
              >
                발송 완료로 변경
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("DELIVERED")}
                className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
              >
                배송 완료로 변경
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange("ISSUE")}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                문제로 표시
              </button>
            </div>
          )}

          {/* 한글 설명: 송장 일괄 업로드 */}
          <button
            type="button"
            onClick={() => setShowBulkUploadModal(true)}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
          >
            송장 일괄 업로드
          </button>

          {/* 한글 설명: 엑셀 다운로드 */}
          <button
            type="button"
            onClick={() => handleExport("xlsx")}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900"
          >
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 한글 설명: 배송 리스트 테이블 */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      shipments.length > 0 &&
                      selectedIds.size === shipments.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-neutral-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  주문번호
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  서포터
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  연락처
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  주소
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  리워드
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  수량
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  금액
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  배송 상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  택배사
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  송장번호
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-700">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-neutral-500">
                    로딩 중...
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-neutral-500">
                    배송 정보가 없습니다.
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(shipment.id)}
                        onChange={() => toggleSelection(shipment.id)}
                        className="rounded border-neutral-300"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {shipment.orderCode}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {shipment.supporterName}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-xs">
                      {shipment.supporterPhone || shipment.address.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-xs max-w-[200px] truncate" title={shipment.address.fullAddress}>
                      {shipment.address.fullAddress}
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      <div>
                        <div className="font-medium">{shipment.reward.title}</div>
                        {shipment.reward.options && (
                          <div className="text-xs text-neutral-500">
                            {shipment.reward.options}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">
                      {shipment.reward.quantity}개
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {currencyKRW(shipment.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          SHIPMENT_STATUS_COLORS[shipment.shipmentStatus]
                        }`}
                      >
                        {SHIPMENT_STATUS_LABELS[shipment.shipmentStatus]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-xs">
                      {shipment.courierName || "-"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 text-xs font-mono">
                      {shipment.trackingNumber || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setShowDetailModal(true);
                        }}
                        className="rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
                      >
                        상세
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 한글 설명: 배송 상세 모달 */}
      {showDetailModal && selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedShipment(null);
          }}
          onStatusChange={handleStatusChange}
          onTrackingUpdate={handleTrackingUpdate}
          onMemoUpdate={handleMemoUpdate}
        />
      )}

      {/* 한글 설명: 송장 일괄 업로드 모달 */}
      {showBulkUploadModal && (
        <BulkTrackingUploadModal
          projectId={projectId}
          onClose={() => setShowBulkUploadModal(false)}
          onSuccess={() => {
            setShowBulkUploadModal(false);
            loadShipments();
          }}
        />
      )}
    </div>
  );
};

