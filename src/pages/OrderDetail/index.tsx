// 한글 설명: 주문 상세보기 페이지
// 결제 후 연결되거나 주문 목록에서 카드 클릭 시 연결되는 페이지
// 주문의 상세 정보(주문 항목, 배송 정보, 결제 정보 등)를 보여주는 페이지
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { getOrder } from "../../services/api";
import type { OrderDetailResponseDTO } from "../../services/api";
import { currencyKRW } from "../../shared/utils/format";

// 한글 설명: 주문 상태 한글 라벨 매핑
const getStatusLabel = (status: "PENDING" | "PAID" | "CANCELLED"): string => {
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

// 한글 설명: 주문 상태 색상 매핑
const getStatusColor = (status: "PENDING" | "PAID" | "CANCELLED"): string => {
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

// 한글 설명: 주문 상세보기 페이지 메인 컴포넌트
export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<OrderDetailResponseDTO | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 주문 상세 조회
  React.useEffect(() => {
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
        const data = await getOrder(orderIdNum);
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

  // 한글 설명: 로딩 중
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

  // 한글 설명: 에러 발생 시
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

  const orderSummary = order.summary;

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

        {/* 한글 설명: 주문 요약 정보 */}
        <section className="rounded-3xl border border-neutral-200 bg-white p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                {orderSummary.orderName}
              </h2>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(
                  orderSummary.status
                )}`}
              >
                {getStatusLabel(orderSummary.status)}
              </span>
            </div>

            <div className="space-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">주문번호</span>
                <span className="font-medium text-neutral-900">
                  {orderSummary.orderCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">주문일시</span>
                <span className="font-medium text-neutral-900">
                  {new Date(orderSummary.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">결제 금액</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {currencyKRW(orderSummary.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 한글 설명: 주문 항목 */}
        {order.items && order.items.length > 0 && (
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              주문 항목
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={`${item.rewardId ?? "unknown"}-${index}`}
                  className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-neutral-900">
                      {item.rewardName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span>수량: {item.quantity}개</span>
                      <span>단가: {currencyKRW(item.rewardPrice)}</span>
                    </div>
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

        {/* 한글 설명: 배송 정보 */}
        {order.shipping && (
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              배송 정보
            </h2>
            <div className="space-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">수령인</span>
                <span className="font-medium text-neutral-900">
                  {order.shipping.receiverName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">연락처</span>
                <span className="font-medium text-neutral-900">
                  {order.shipping.receiverPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">주소</span>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">
                    [{order.shipping.zipCode}] {order.shipping.addressLine1}
                    {order.shipping.addressLine2
                      ? ` ${order.shipping.addressLine2}`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 한글 설명: 결제 정보 */}
        {order.payment && (
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              결제 정보
            </h2>
            <div className="space-y-2 rounded-xl bg-neutral-50 p-4 text-sm">
              {order.payment.method && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">결제 수단</span>
                  <span className="font-medium text-neutral-900">
                    {order.payment.method}
                  </span>
                </div>
              )}
              {order.payment.cardMasked && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">카드 정보</span>
                  <span className="font-medium text-neutral-900">
                    {order.payment.cardMasked}
                  </span>
                </div>
              )}
              {order.payment.paidAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">결제 시각</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(order.payment.paidAt).toLocaleString("ko-KR")}
                  </span>
                </div>
              )}
              {order.receiptUrl && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">영수증</span>
                  <a
                    href={order.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    영수증 보기
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 한글 설명: 배송 타임라인 */}
        {order.timeline && (
          <section className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              배송 타임라인
            </h2>
            <div className="space-y-2 text-sm">
              {order.timeline.deliveryStartedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">배송 시작</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(order.timeline.deliveryStartedAt).toLocaleString(
                      "ko-KR"
                    )}
                  </span>
                </div>
              )}
              {order.timeline.deliveryCompletedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">배송 완료</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(
                      order.timeline.deliveryCompletedAt
                    ).toLocaleString("ko-KR")}
                  </span>
                </div>
              )}
              {order.timeline.confirmedAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">결제 확정</span>
                  <span className="font-medium text-neutral-900">
                    {new Date(order.timeline.confirmedAt).toLocaleString(
                      "ko-KR"
                    )}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 한글 설명: 액션 버튼 */}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile/supporter/orders")}
            className="rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            주문 목록으로
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            홈으로
          </button>
        </div>
      </div>
    </Container>
  );
};
