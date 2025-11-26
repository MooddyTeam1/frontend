// 한글 설명: 주문 목록 페이지
// 서포터 보기의 "최근 후원" 섹션의 "더보기" 페이지
// 사용자가 후원한 주문 목록을 보여주는 페이지
import React from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { getOrders } from "../../services/api";
import type {
  OrderSummaryResponseDTO,
  // OrderListResponseDTO, // 한글 설명: 현재 미사용
} from "../../services/api";
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

// 한글 설명: 주문 목록 페이지 메인 컴포넌트
export const OrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = React.useState<OrderSummaryResponseDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // 한글 설명: 주문 목록 조회
  React.useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrders(0, 50); // 한글 설명: 최대 50개 조회
        // 한글 설명: 백엔드 응답은 content 필드에 주문 목록이 있음
        setOrders(data?.content ?? []);
      } catch (err) {
        console.error("주문 목록 조회 실패", err);
        setError(
          err instanceof Error
            ? err.message
            : "주문 목록을 불러오지 못했습니다."
        );
        // 한글 설명: 에러 발생 시 빈 배열로 설정
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // 한글 설명: 주문 상세보기로 이동
  const handleOrderClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <Container>
      <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col gap-6 py-16">
        {/* 한글 설명: 헤더 */}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">
            내 주문 내역
          </h1>
          <p className="text-sm text-neutral-500">
            후원한 프로젝트의 주문 내역을 확인할 수 있습니다.
          </p>
        </header>

        {/* 한글 설명: 에러 메시지 */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 한글 설명: 주문 목록 */}
        {loading ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-500">
              주문 목록을 불러오는 중입니다...
            </p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-sm text-neutral-500">
              아직 후원한 프로젝트가 없습니다.
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              프로젝트를 후원하면 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <button
                key={order.orderId}
                type="button"
                onClick={() => handleOrderClick(order.orderId)}
                className="w-full rounded-3xl border border-neutral-200 bg-white p-6 text-left transition hover:border-neutral-900 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* 한글 설명: 주문 정보 */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-neutral-900">
                        {order.orderName}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">주문번호:</span>
                        <span className="font-medium">{order.orderCode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">주문일시:</span>
                        <span>
                          {new Date(order.createdAt).toLocaleString("ko-KR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 한글 설명: 결제 금액 */}
                  <div className="text-right">
                    <p className="text-lg font-semibold text-neutral-900">
                      {currencyKRW(order.totalAmount)}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">결제 금액</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};
