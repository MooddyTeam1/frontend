// 한글 설명: 서포터 주문 상세 페이지
// 서포터가 자신의 주문 상세를 확인하고, 배송 수령 완료를 직접 누르는 UI
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { currencyKRW } from "../../shared/utils/format";
import api from "../../services/api";

// 한글 설명: 주문 상세 응답 타입 정의
interface SupporterOrderDetailResponse {
  orderId: number;
  orderCode: string;
  orderName: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  deliveryStatus:
    | "NONE"
    | "PREPARING"
    | "SHIPPING"
    | "DELIVERED"
    | "CONFIRMED"
    | "ISSUE";
  receiverName: string;
  receiverPhone: string;
  addressLine1: string;
  addressLine2: string | null;
  zipCode: string;
  courierName: string | null;
  trackingNumber: string | null;
  deliveryStartedAt: string | null;
  deliveryCompletedAt: string | null;
  confirmedAt: string | null;
  deliveryIssueReason: string | null;
  items: Array<{
    rewardName: string;
    quantity: number;
    subtotal: number;
  }>;
  totalAmount: number;
  createdAt: string;
  paidAt: string | null;
}

// 한글 설명: 배송 상태 한글 라벨 매핑 함수
const getDeliveryStatusLabel = (
  status: SupporterOrderDetailResponse["deliveryStatus"]
): string => {
  switch (status) {
    case "NONE":
      return "배송 준비 전";
    case "PREPARING":
      return "배송 준비 중";
    case "SHIPPING":
      return "배송 중";
    case "DELIVERED":
      return "배송 완료(자동)";
    case "CONFIRMED":
      return "수령 완료(서포터 확인)";
    case "ISSUE":
      return "문제/보류";
    default:
      return status;
  }
};

// 한글 설명: 배송 상태 색상 매핑 함수
const getDeliveryStatusColor = (
  status: SupporterOrderDetailResponse["deliveryStatus"]
): string => {
  switch (status) {
    case "NONE":
      return "text-neutral-600 bg-neutral-50 border-neutral-200";
    case "PREPARING":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "SHIPPING":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "DELIVERED":
      return "text-green-600 bg-green-50 border-green-200";
    case "CONFIRMED":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "ISSUE":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-neutral-600 bg-neutral-50 border-neutral-200";
  }
};

// 한글 설명: 주문 상태 한글 라벨 매핑 함수
const getStatusLabel = (
  status: "PENDING" | "PAID" | "CANCELLED"
): string => {
  switch (status) {
    case "PENDING":
      return "결제 대기";
    case "PAID":
      return "결제 완료";
    case "CANCELLED":
      return "취소됨";
    default:
      return status;
  }
};

// 한글 설명: 주문 상태 색상 매핑 함수
const getStatusColor = (
  status: "PENDING" | "PAID" | "CANCELLED"
): string => {
  switch (status) {
    case "PENDING":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "PAID":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "CANCELLED":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-neutral-600 bg-neutral-50 border-neutral-200";
  }
};

// 한글 설명: 날짜 포맷팅 함수
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// 한글 설명: 날짜와 시간 포맷팅 함수
const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR");
};

// 한글 설명: 서포터 주문 상세 조회 API 함수
// GET /api/supporter/orders/{orderId}
const getSupporterOrder = async (
  orderId: number
): Promise<SupporterOrderDetailResponse> => {
  const response = await api.get<SupporterOrderDetailResponse>(
    `/api/supporter/orders/${orderId}`
  );
  return response.data;
};

// 한글 설명: 배송 수령 완료(구매 확정) API 함수
// PATCH /api/supporter/orders/{orderId}/delivery/confirm
const confirmDelivery = async (orderId: number): Promise<void> => {
  await api.patch(`/api/supporter/orders/${orderId}/delivery/confirm`);
};

// 한글 설명: 서포터 주문 상세 페이지 메인 컴포넌트
export const SupporterOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // 한글 설명: 주문 상세 정보 상태
  const [order, setOrder] = useState<SupporterOrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 수령 완료 처리 중 상태
  const [confirming, setConfirming] = useState(false);
  // 한글 설명: 확인 모달 표시 여부
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 한글 설명: 주문 상세 조회
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("주문 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const orderIdNum = parseInt(orderId, 10);
        if (isNaN(orderIdNum)) {
          throw new Error("유효하지 않은 주문 ID입니다.");
        }
        const data = await getSupporterOrder(orderIdNum);
        setOrder(data);
      } catch (err) {
        console.error("주문 상세 조회 실패", err);
        setError(
          err instanceof Error
            ? err.message
            : "주문 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // 한글 설명: 수령 완료 버튼 활성화 여부 계산
  const canConfirmDelivery =
    order &&
    (order.deliveryStatus === "SHIPPING" ||
      order.deliveryStatus === "DELIVERED");

  // 한글 설명: 수령 완료 확인 모달 열기
  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
  };

  // 한글 설명: 수령 완료 확인 모달 닫기
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
  };

  // 한글 설명: 수령 완료 처리
  const handleConfirmDelivery = async () => {
    if (!order) return;

    setConfirming(true);
    try {
      await confirmDelivery(order.orderId);
      // 한글 설명: 성공 시 주문 정보 다시 조회하여 최신 상태 반영
      const updatedOrder = await getSupporterOrder(order.orderId);
      setOrder(updatedOrder);
      setShowConfirmModal(false);
      // 한글 설명: 사용자에게 성공 메시지 표시
      alert("수령 완료가 처리되었습니다.");
    } catch (err) {
      console.error("수령 완료 처리 실패", err);
      // 한글 설명: 에러 메시지 표시
      alert(
        err instanceof Error
          ? err.message
          : "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setConfirming(false);
    }
  };

  // 한글 설명: 로딩 중 UI
  if (loading) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center py-16">
          <div className="text-center">
            <p className="text-sm text-neutral-500">
              주문 정보를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </Container>
    );
  }

  // 한글 설명: 에러 발생 시 UI
  if (error || !order) {
    return (
      <Container>
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center py-16">
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium text-red-600">
              {error ?? "주문 정보를 불러올 수 없습니다."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/profile/supporter/orders")}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                주문 목록으로
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // 한글 설명: 배송 예상 흐름 텍스트 생성
  const getDeliveryFlowText = (): string => {
    if (order.deliveryStatus === "SHIPPING" && order.deliveryStartedAt) {
      return `배송 상태: ${getDeliveryStatusLabel(order.deliveryStatus)} · ${formatDate(order.deliveryStartedAt)} 출발`;
    } else if (
      order.deliveryStatus === "DELIVERED" &&
      order.deliveryCompletedAt
    ) {
      return `배송 상태: ${getDeliveryStatusLabel(order.deliveryStatus)} · ${formatDate(order.deliveryCompletedAt)} 도착`;
    } else if (order.deliveryStatus === "CONFIRMED" && order.confirmedAt) {
      return `배송 상태: ${getDeliveryStatusLabel(order.deliveryStatus)} · ${formatDate(order.confirmedAt)} 확인`;
    }
    return `배송 상태: ${getDeliveryStatusLabel(order.deliveryStatus)}`;
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 py-16">
        {/* 한글 설명: 헤더 */}
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral-900">
              주문 상세
            </h1>
            <button
              type="button"
              onClick={() => navigate("/profile/supporter/orders")}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              목록으로
            </button>
          </div>
          <p className="text-sm text-neutral-500">
            주문 정보와 배송 정보를 확인할 수 있습니다.
          </p>
        </header>

        {/* 한글 설명: 주문 기본 정보 영역 */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                {order.orderName}
              </h2>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="space-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">주문번호</span>
                <span className="font-medium text-neutral-900">
                  {order.orderCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">주문일시</span>
                <span className="font-medium text-neutral-900">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">배송 상태</span>
                <span
                  className={`rounded-full border px-2 py-1 text-xs font-medium ${getDeliveryStatusColor(
                    order.deliveryStatus
                  )}`}
                >
                  {getDeliveryStatusLabel(order.deliveryStatus)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">총 결제 금액</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {currencyKRW(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 한글 설명: 배송지/송장 정보 영역 */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            배송 정보
          </h2>
          <div className="space-y-4">
            {/* 한글 설명: 수령인 정보 */}
            <div className="space-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">수령인</span>
                <span className="font-medium text-neutral-900">
                  {order.receiverName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">연락처</span>
                <span className="font-medium text-neutral-900">
                  {order.receiverPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">주소</span>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">
                    [{order.zipCode}] {order.addressLine1}
                    {order.addressLine2 ? ` ${order.addressLine2}` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* 한글 설명: 택배사 및 송장번호 */}
            {(order.courierName || order.trackingNumber) && (
              <div className="space-y-2 rounded-xl bg-blue-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">택배사</span>
                  <span className="font-medium text-neutral-900">
                    {order.courierName || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">운송장번호</span>
                  <span className="font-mono font-medium text-neutral-900">
                    {order.trackingNumber || "-"}
                  </span>
                </div>
              </div>
            )}

            {/* 한글 설명: 배송 예상 흐름 */}
            <div className="rounded-xl bg-neutral-50 p-4 text-sm">
              <p className="font-medium text-neutral-900">
                {getDeliveryFlowText()}
              </p>
            </div>
          </div>
        </section>

        {/* 한글 설명: 리워드 아이템 목록 영역 */}
        {order.items && order.items.length > 0 && (
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              주문 항목
            </h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-neutral-900">
                      {item.rewardName}
                    </p>
                    <p className="text-sm text-neutral-600">
                      수량: {item.quantity}개
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-neutral-900">
                      {currencyKRW(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 한글 설명: 수령 완료 버튼 (고정 위치) */}
        <div className="sticky bottom-0 rounded-3xl border border-neutral-200 bg-white p-6 shadow-lg">
          <button
            type="button"
            onClick={handleOpenConfirmModal}
            disabled={!canConfirmDelivery || confirming}
            className={`w-full rounded-full px-6 py-3 text-sm font-semibold transition ${
              canConfirmDelivery && !confirming
                ? "border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800"
                : "border border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
            }`}
          >
            {confirming ? "처리 중..." : "수령 완료"}
          </button>
        </div>

        {/* 한글 설명: 확인 모달 */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleCloseConfirmModal}
          >
            <div
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-4 text-lg font-semibold text-neutral-900">
                수령 완료 확인
              </h3>
              <p className="mb-6 text-sm text-neutral-600">
                리워드를 실제로 수령하셨나요? 수령 완료 후에는 환불이 어려울
                수 있습니다.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseConfirmModal}
                  disabled={confirming}
                  className="flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelivery}
                  disabled={confirming}
                  className="flex-1 rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  {confirming ? "처리 중..." : "수령 완료"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

