// 한글 설명: Mock API 구현 (가이드 스펙에 맞춤)
// 주의: 실제 백엔드 API가 준비되면 이 Mock API는 사용되지 않습니다
import type {
  CreateOrderRequestDTO,
  OrderDetailResponseDTO,
  OrderSummaryResponseDTO,
  OrderListResponseDTO,
  ConfirmPaymentRequestDTO,
  PaymentResponseDTO,
} from "./api";

// 한글 설명: 주문 코드 생성 함수 (가이드 스펙에 맞춤)
// 예시: "ORD-20251108-A3F2B8C1"
function generateOrderCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ""); // "20251108"
  const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase(); // "A3F2B8C1"
  return `ORD-${dateStr}-${randomStr}`;
}

// 한글 설명: Mock 주문 생성 API (백엔드 OrderDetailResponse 구조에 맞춤)
// 백엔드: POST /api/orders
// 응답: OrderDetailResponse (summary, shipping, payment, receiptUrl, timeline, items)
export const createOrder = async (
  orderData: CreateOrderRequestDTO
): Promise<OrderDetailResponseDTO> => {
  // 한글 설명: 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 500));

  const orderCode = generateOrderCode();
  const orderId = Date.now(); // 한글 설명: 임시 주문 ID

  // 한글 설명: 주문명 생성 (리워드 이름 기반)
  const orderName =
    orderData.items.length === 1
      ? orderData.items[0].rewardId
      : `${orderData.items[0].rewardId} 외 ${orderData.items.length - 1}건`;

  // 한글 설명: 총 금액 계산 (실제로는 백엔드에서 서버 측에서 계산해야 함)
  // 주의: Mock에서는 임시로 0으로 설정 (백엔드에서 실제 가격 계산)
  const totalAmount = 0;

  const order: OrderDetailResponseDTO = {
    summary: {
      orderId,
      orderCode,
      projectId: null, // 한글 설명: Mock에서는 null
      orderName,
      totalAmount,
      status: "PENDING",
      deliveryStatus: null,
      createdAt: new Date().toISOString(),
    },
    shipping: {
      receiverName: orderData.receiverName,
      receiverPhone: orderData.receiverPhone,
      addressLine1: orderData.addressLine1,
      addressLine2: orderData.addressLine2 ?? null,
      zipCode: orderData.zipCode ?? "",
    },
    payment: null, // 한글 설명: 주문 생성 시점에는 결제 정보 없음
    receiptUrl: null,
    timeline: {
      deliveryStartedAt: null,
      deliveryCompletedAt: null,
      confirmedAt: null,
    },
    items: orderData.items.map((item) => ({
      rewardId: typeof item.rewardId === "string" ? parseInt(item.rewardId, 10) : (item.rewardId ?? 0),
      rewardName: `리워드 ${item.rewardId}`, // 한글 설명: 실제로는 백엔드에서 리워드 이름 조회
      rewardPrice: 0, // 한글 설명: 실제로는 백엔드에서 리워드 가격 조회
      quantity: item.quantity,
      subtotal: 0, // 한글 설명: 실제로는 rewardPrice * quantity
    })),
  };

  console.log("✅ [Mock] 주문 생성 완료:", order);

  return order;
};

// 한글 설명: Mock 결제 승인 API (가이드 스펙에 맞춤)
export const confirmPayment = async (
  paymentData: ConfirmPaymentRequestDTO
): Promise<PaymentResponseDTO> => {
  // 한글 설명: 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 500));

  const payment: PaymentResponseDTO = {
    paymentId: Date.now(), // 한글 설명: Mock에서는 타임스탬프를 ID로 사용 (백엔드에서는 Long 타입)
    orderId: paymentData.orderId, // 한글 설명: 백엔드 스펙에 맞춰 orderId 사용 (실제 값은 orderCode)
    paymentKey: `mock_payment_${Date.now()}`, // 한글 설명: Mock 결제 키
    amount: paymentData.amount,
    method: "카드",
    status: "DONE", // 한글 설명: 결제 상태 (백엔드에서는 String 타입)
    approvedAt: new Date().toISOString(), // 한글 설명: 승인 시각 (ISO 8601 형식)
    // 한글 설명: 테스트 환경에서는 실제 영수증 URL이 제공되지 않음
    // 실제 백엔드에서는 토스페이먼츠 API 응답의 receipt.url을 사용해야 함
    // receiptUrl은 백엔드에서 실제 토스페이먼츠 API 응답을 받아서 설정해야 함
    receiptUrl: null, // 한글 설명: 테스트 환경에서는 영수증 URL 제공 안 함 (null)
  };

  console.log("✅ [Mock] 결제 승인 완료:", payment);

  return payment;
};

// 한글 설명: Mock 주문 목록 조회 API
// 백엔드: GET /api/orders?page={page}&size={size}
// 응답: OrderPageResponse (content, page, size, totalElements, totalPages)
export const getOrders = async (
  page: number = 0,
  size: number = 20
): Promise<OrderListResponseDTO> => {
  // 한글 설명: 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 한글 설명: Mock에서는 빈 목록 반환 (실제로는 localStorage에서 조회 가능)
  const content: OrderSummaryResponseDTO[] = [];

  return {
    content,
    page,
    size,
    totalElements: 0,
    totalPages: 0,
  };
};

// 한글 설명: Mock 주문 상세 조회 API
// 백엔드: GET /api/orders/{orderId}
// 응답: OrderDetailResponse (summary, shipping, payment, receiptUrl, timeline, items)
export const getOrder = async (orderId: string): Promise<OrderDetailResponseDTO> => {
  // 한글 설명: 실제 API 호출 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 한글 설명: Mock에서는 주문을 찾을 수 없다고 가정
  throw new Error(`주문을 찾을 수 없습니다: ${orderId}`);
};

/*
// 기존 mock 구현은 참고만 가능합니다.
*/

