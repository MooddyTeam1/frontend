// 한글 설명: 배송 상세 모달 컴포넌트
import React, { useState } from "react";
import { currencyKRW } from "../../../../../shared/utils/format";
import type {
  ShipmentDTO,
  ShipmentStatus,
} from "../../../../../features/maker/projectManagement/types/shipment";
import {
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_COLORS,
} from "../../../../../features/maker/projectManagement/types/shipment";

type ShipmentDetailModalProps = {
  shipment: ShipmentDTO;
  onClose: () => void;
  onStatusChange: (
    shipmentId: number,
    status: ShipmentStatus,
    issueReason?: string
  ) => Promise<void>;
  onTrackingUpdate: (
    shipmentId: number,
    courierName: string,
    trackingNumber: string
  ) => Promise<void>;
  onMemoUpdate: (shipmentId: number, memo: string) => Promise<void>;
};

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  shipment,
  onClose,
  onStatusChange,
  onTrackingUpdate,
  onMemoUpdate,
}) => {
  const [editingTracking, setEditingTracking] = useState(false);
  const [editingMemo, setEditingMemo] = useState(false);
  const [courierName, setCourierName] = useState(shipment.courierName || "");
  const [trackingNumber, setTrackingNumber] = useState(
    shipment.trackingNumber || ""
  );
  const [memo, setMemo] = useState(shipment.memo || "");
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ShipmentStatus | null>(null);
  const [issueReason, setIssueReason] = useState("");

  // 한글 설명: 송장 정보 저장
  const handleSaveTracking = async () => {
    if (!courierName.trim() || !trackingNumber.trim()) {
      alert("택배사와 송장번호를 모두 입력해주세요.");
      return;
    }
    await onTrackingUpdate(shipment.id, courierName.trim(), trackingNumber.trim());
    setEditingTracking(false);
  };

  // 한글 설명: 메모 저장
  const handleSaveMemo = async () => {
    await onMemoUpdate(shipment.id, memo);
    setEditingMemo(false);
  };

  // 한글 설명: 배송 상태 변경
  const handleStatusChange = async () => {
    if (!newStatus) return;
    if (newStatus === "ISSUE" && !issueReason.trim()) {
      alert("문제 사유를 입력해주세요.");
      return;
    }
    setChangingStatus(true);
    try {
      await onStatusChange(
        shipment.id,
        newStatus,
        newStatus === "ISSUE" ? issueReason.trim() : undefined
      );
      setNewStatus(null);
      setIssueReason("");
    } finally {
      setChangingStatus(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 한글 설명: 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">
              배송 상세 정보
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

          <div className="space-y-6">
            {/* 한글 설명: 서포터 정보 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                서포터 정보
              </h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-neutral-500 text-xs">이름</dt>
                  <dd className="mt-1 font-medium text-neutral-900">
                    {shipment.supporterName}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 text-xs">연락처</dt>
                  <dd className="mt-1 text-neutral-700">
                    {shipment.supporterPhone || shipment.address.phone || "-"}
                  </dd>
                </div>
                {shipment.supporterEmail && (
                  <div>
                    <dt className="text-neutral-500 text-xs">이메일</dt>
                    <dd className="mt-1 text-neutral-700">
                      {shipment.supporterEmail}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-neutral-500 text-xs">주문번호</dt>
                  <dd className="mt-1 font-mono text-neutral-700">
                    {shipment.orderCode}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 한글 설명: 배송지 정보 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                배송지 정보
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-neutral-500 text-xs">수령인</dt>
                  <dd className="mt-1 text-neutral-700">
                    {shipment.address.recipient}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 text-xs">연락처</dt>
                  <dd className="mt-1 text-neutral-700">
                    {shipment.address.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 text-xs">주소</dt>
                  <dd className="mt-1 text-neutral-700 whitespace-pre-line">
                    [{shipment.address.postalCode}] {shipment.address.address1}
                    {shipment.address.address2 ? `\n${shipment.address.address2}` : ""}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 한글 설명: 리워드 정보 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                리워드 정보
              </h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-neutral-500 text-xs">리워드명</dt>
                  <dd className="mt-1 font-medium text-neutral-900">
                    {shipment.reward.title}
                  </dd>
                </div>
                {shipment.reward.options && (
                  <div>
                    <dt className="text-neutral-500 text-xs">옵션</dt>
                    <dd className="mt-1 text-neutral-700">
                      {shipment.reward.options}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-neutral-500 text-xs">수량</dt>
                  <dd className="mt-1 text-neutral-700">
                    {shipment.reward.quantity}개
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500 text-xs">결제 금액</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">
                    {currencyKRW(shipment.amount)}
                  </dd>
                </div>
              </dl>
            </section>

            {/* 한글 설명: 배송 상태 및 송장 정보 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                배송 상태
              </h3>
              <div className="space-y-4">
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      SHIPMENT_STATUS_COLORS[shipment.shipmentStatus]
                    }`}
                  >
                    {SHIPMENT_STATUS_LABELS[shipment.shipmentStatus]}
                  </span>
                </div>

                {/* 한글 설명: 송장 정보 */}
                {editingTracking ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-700">
                        택배사
                      </label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        placeholder="예: CJ대한통운, 한진택배"
                        className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-700">
                        송장번호
                      </label>
                      <input
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="송장번호 입력"
                        className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveTracking}
                        className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTracking(false);
                          setCourierName(shipment.courierName || "");
                          setTrackingNumber(shipment.trackingNumber || "");
                        }}
                        className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-neutral-500">택배사</span>
                      <p className="mt-1 text-sm text-neutral-700">
                        {shipment.courierName || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-500">송장번호</span>
                      <p className="mt-1 text-sm font-mono text-neutral-700">
                        {shipment.trackingNumber || "-"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingTracking(true)}
                      className="rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400"
                    >
                      {shipment.courierName ? "수정" : "송장 입력"}
                    </button>
                  </div>
                )}

                {/* 한글 설명: 배송 상태 변경 */}
                {!changingStatus ? (
                  <div>
                    <label className="text-xs font-medium text-neutral-700 mb-2 block">
                      배송 상태 변경
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        Object.keys(SHIPMENT_STATUS_LABELS) as ShipmentStatus[]
                      ).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setNewStatus(status)}
                          disabled={status === shipment.shipmentStatus}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                            status === shipment.shipmentStatus
                              ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                              : newStatus === status
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                          }`}
                        >
                          {SHIPMENT_STATUS_LABELS[status]}
                        </button>
                      ))}
                    </div>
                    {newStatus && (
                      <div className="mt-3 space-y-2">
                        {newStatus === "ISSUE" && (
                          <div>
                            <label className="text-xs font-medium text-neutral-700">
                              문제 사유
                            </label>
                            <textarea
                              value={issueReason}
                              onChange={(e) => setIssueReason(e.target.value)}
                              placeholder="문제 사유를 입력해주세요"
                              rows={3}
                              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleStatusChange}
                            className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                          >
                            상태 변경
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewStatus(null);
                              setIssueReason("");
                            }}
                            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
                          >
                            취소
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-neutral-500">
                    상태 변경 중...
                  </div>
                )}
              </div>
            </section>

            {/* 한글 설명: 메모 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                내부 메모
              </h3>
              {editingMemo ? (
                <div className="space-y-3">
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="내부 메모를 입력하세요"
                    rows={4}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveMemo}
                      className="flex-1 rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMemo(false);
                        setMemo(shipment.memo || "");
                      }}
                      className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                    {shipment.memo || "메모가 없습니다."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingMemo(true)}
                    className="mt-2 rounded-xl border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400"
                  >
                    {shipment.memo ? "수정" : "메모 추가"}
                  </button>
                </div>
              )}
            </section>

            {/* 한글 설명: 배송 이력 */}
            <section className="rounded-2xl border border-neutral-200 p-4">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                배송 이력
              </h3>
              <div className="space-y-2 text-xs text-neutral-600">
                <div>
                  <span className="text-neutral-500">주문일:</span>{" "}
                  {new Date(shipment.orderedAt).toLocaleString("ko-KR")}
                </div>
                {shipment.paidAt && (
                  <div>
                    <span className="text-neutral-500">결제일:</span>{" "}
                    {new Date(shipment.paidAt).toLocaleString("ko-KR")}
                  </div>
                )}
                {shipment.shippedAt && (
                  <div>
                    <span className="text-neutral-500">발송일:</span>{" "}
                    {new Date(shipment.shippedAt).toLocaleString("ko-KR")}
                  </div>
                )}
                {shipment.deliveredAt && (
                  <div>
                    <span className="text-neutral-500">배송 완료일:</span>{" "}
                    {new Date(shipment.deliveredAt).toLocaleString("ko-KR")}
                  </div>
                )}
                {shipment.issueReason && (
                  <div>
                    <span className="text-neutral-500">문제 사유:</span>{" "}
                    <span className="text-red-600">{shipment.issueReason}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

