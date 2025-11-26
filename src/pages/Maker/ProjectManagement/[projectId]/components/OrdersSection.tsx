// 한글 설명: 주문/서포터 관리 섹션
import React from "react";
import {
  getProjectOrders,
  exportProjectOrders,
} from "../../../../../features/maker/projectManagement/api/projectManagementService";
import type { OrderItemDTO } from "../../../../../features/maker/projectManagement/types";
// ============================================
// Mock 데이터 사용 중단 - 주석처리됨
// ============================================
// import { mockOrders } from "../../../../../features/maker/projectManagement/mockData";
import { currencyKRW } from "../../../../../shared/utils/format";

// 한글 설명: Mock API 사용 여부 (개발 중 확인용)
// ============================================
// Mock 데이터 사용 중단 - 주석처리됨
// ============================================
// const USE_MOCK_DATA = true;

type OrdersSectionProps = {
  projectId: number;
};

const PAYMENT_STATUS_LABELS: Record<OrderItemDTO["paymentStatus"], string> = {
  SUCCESS: "결제완료",
  CANCELLED: "취소됨",
  REFUNDED: "환불됨",
  PENDING: "대기중",
};

const DELIVERY_STATUS_LABELS: Record<OrderItemDTO["deliveryStatus"], string> = {
  PREPARING: "준비중",
  SHIPPED: "발송완료",
  DELIVERED: "전달완료",
  NONE: "배송없음",
};

export const OrdersSection: React.FC<OrdersSectionProps> = ({ projectId }) => {
  const [orders, setOrders] = React.useState<OrderItemDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState({
    paymentStatus: "",
    deliveryStatus: "",
  });

  React.useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        // ============================================
        // Mock 데이터 사용 중단 - 주석처리됨
        // ============================================
        // if (USE_MOCK_DATA) {
        //   // 한글 설명: Mock 데이터 사용
        //   await new Promise((resolve) => setTimeout(resolve, 300)); // 로딩 시뮬레이션
        //
        //   // 한글 설명: 필터 적용
        //   let filteredOrders = [...mockOrders];
        //
        //   if (filter.paymentStatus) {
        //     filteredOrders = filteredOrders.filter(
        //       (o) => o.paymentStatus === filter.paymentStatus
        //     );
        //   }
        //
        //   if (filter.deliveryStatus) {
        //     filteredOrders = filteredOrders.filter(
        //       (o) => o.deliveryStatus === filter.deliveryStatus
        //     );
        //   }
        //
        //   setOrders(filteredOrders);
        // } else {
        // 한글 설명: 실제 API 호출
        const data = await getProjectOrders(projectId, {
          ...filter,
          page: 1,
          pageSize: 50,
        });
        setOrders(data.orders);
        // }
      } catch (error) {
        console.error("주문 목록 조회 실패:", error);
        alert("주문 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [projectId, filter]);

  const handleExport = async (format: "csv" | "xlsx") => {
    try {
      const blob = await exportProjectOrders(projectId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `주문목록_${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("엑셀 다운로드 실패:", error);
      alert("엑셀 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">
          주문/서포터 관리
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleExport("csv")}
            className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            CSV 다운로드
          </button>
          <button
            type="button"
            onClick={() => handleExport("xlsx")}
            className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 한글 설명: 필터 */}
      <div className="mb-4 flex gap-2">
        <select
          value={filter.paymentStatus}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, paymentStatus: e.target.value }))
          }
          className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs"
        >
          <option value="">결제 상태 전체</option>
          <option value="SUCCESS">결제완료</option>
          <option value="CANCELLED">취소됨</option>
          <option value="REFUNDED">환불됨</option>
          <option value="PENDING">대기중</option>
        </select>
        <select
          value={filter.deliveryStatus}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, deliveryStatus: e.target.value }))
          }
          className="rounded border border-neutral-200 bg-white px-3 py-2 text-xs"
        >
          <option value="">배송 상태 전체</option>
          <option value="PREPARING">준비중</option>
          <option value="SHIPPED">발송완료</option>
          <option value="DELIVERED">전달완료</option>
          <option value="NONE">배송없음</option>
        </select>
      </div>

      {loading ? (
        <div className="py-10 text-center text-sm text-neutral-500">
          로딩 중...
        </div>
      ) : orders?.length === 0 ? (
        <div className="py-10 text-center text-sm text-neutral-500">
          주문이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-3 py-2 text-left text-neutral-500">
                  주문번호
                </th>
                <th className="px-3 py-2 text-left text-neutral-500">서포터</th>
                <th className="px-3 py-2 text-left text-neutral-500">리워드</th>
                <th className="px-3 py-2 text-right text-neutral-500">금액</th>
                <th className="px-3 py-2 text-center text-neutral-500">
                  결제 상태
                </th>
                <th className="px-3 py-2 text-center text-neutral-500">
                  배송 상태
                </th>
                <th className="px-3 py-2 text-left text-neutral-500">주문일</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.orderId} className="border-b border-neutral-100">
                  <td className="px-3 py-3 font-mono text-neutral-700">
                    {order.orderCode}
                  </td>
                  <td className="px-3 py-3 text-neutral-700">
                    {order.supporterName}
                  </td>
                  <td className="px-3 py-3 text-neutral-700">
                    {order.rewardTitle}
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-neutral-900">
                    {currencyKRW(order.amount)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        order.paymentStatus === "SUCCESS"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "CANCELLED" ||
                              order.paymentStatus === "REFUNDED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        order.deliveryStatus === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.deliveryStatus === "SHIPPED"
                            ? "bg-blue-100 text-blue-700"
                            : order.deliveryStatus === "PREPARING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-neutral-500">
                    {new Date(order.orderedAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
