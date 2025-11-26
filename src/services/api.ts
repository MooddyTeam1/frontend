// 한글 설명: API 통신을 위한 axios 인스턴스 및 API 함수들
import axios from "axios";

// 한글 설명: 환경별 API 기본 URL 설정
// - 개발 환경 (.env.development): http://localhost:8080
// - 배포 환경 (.env.production): EC2 백엔드 주소
// - 로컬 오버라이드 (.env.local): 개인 설정 (선택적)
const getApiBaseUrl = (): string => {
  const env = import.meta.env.MODE; // 'development' | 'production'
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (baseUrl) {
    return baseUrl;
  }

  // 한글 설명: 환경변수가 없을 경우 환경에 따라 기본값 설정
  if (env === "production") {
    console.warn(
      "⚠️ VITE_API_BASE_URL이 설정되지 않았습니다. 프로덕션 환경에서는 EC2 백엔드 주소를 설정해주세요."
    );
    // 한글 설명: 프로덕션에서는 기본값을 제공하지 않음 (명시적 설정 필요)
    throw new Error(
      "프로덕션 환경에서는 VITE_API_BASE_URL 환경변수를 설정해야 합니다."
    );
  }

  // 한글 설명: 개발 환경 기본값
  return "http://localhost:8080";
};

// 한글 설명: API 기본 URL을 export하여 다른 파일에서도 사용 가능하도록 함
export const API_BASE_URL = getApiBaseUrl();

// 한글 설명: Axios 인스턴스 생성
const api = axios.create({
  // 한글 설명: 백엔드 기본 URL 설정
  baseURL: getApiBaseUrl(),

  // 한글 설명: 요청 타임아웃 (10초)
  timeout: 30000,

  // 한글 설명: CORS + 인증정보(쿠키 등) 포함 요청 허용
  // - 지금은 JWT를 Authorization 헤더로 쓰지만,
  //   나중에 OAuth2 로그인에서 쿠키가 쓰일 수도 있으니 true로 설정해두면 유연함
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

// 한글 설명: 현재 API 설정 로그 (개발 환경에서만)
if (import.meta.env.DEV) {
  console.log("🔧 API 설정:", {
    mode: import.meta.env.MODE,
    baseURL: api.defaults.baseURL,
    useMockApi: import.meta.env.VITE_USE_MOCK_API === "true",
  });
}

// 한글 설명: 요청 인터셉터 (JWT 토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // 한글 설명: Authorization 헤더에 Bearer 토큰 추가
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 한글 설명: 백엔드 에러 응답 형식에서 메시지 추출 유틸 함수
export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return error.message || "알 수 없는 오류가 발생했습니다.";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

// 한글 설명: 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 한글 설명: 이미지 업로드 응답 DTO
export interface ImageUploadResponseDTO {
  imageUrl: string; // 한글 설명: 업로드된 이미지의 URL
  filename?: string; // 한글 설명: 파일명 (선택적)
}

// 한글 설명: 이미지 업로드 API
// 백엔드 API: POST /api/uploads/images
// body: FormData (multipart/form-data)
export const uploadImage = async (file: File): Promise<ImageUploadResponseDTO> => {
  const formData = new FormData();
  formData.append("file", file);

  // 한글 설명: multipart/form-data 요청이므로 Content-Type을 자동으로 설정하도록 헤더 제거
  const response = await api.post<ImageUploadResponseDTO>(
    "/api/uploads/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// 한글 설명: AI 설명 생성 응답 DTO (백엔드 ImageListingResultResponse와 매핑)
export interface AIGeneratedListingResponseDTO {
  title: string; // 한글 설명: 프로젝트 제목
  shortDescription: string; // 한글 설명: 요약 소개 (summary 대신 shortDescription)
  story: string; // 한글 설명: 스토리 (마크다운 형식)
  tags: string[]; // 한글 설명: 태그 배열
  category: string; // 한글 설명: 카테고리 enum (예: "TECH", "FOOD", "FASHION")
  categoryName: string; // 한글 설명: 카테고리 한글 이름 (예: "테크", "푸드", "패션")
}

// 한글 설명: AI 설명 생성 API
// 백엔드 API: POST /api/ai/listing
// body: FormData (multipart/form-data)
// - image: 필수 (MultipartFile)
// - hint: 선택적 (String) - 추가 힌트/요구사항
// - tone: 선택적 (String) - 톤/스타일 (예: "친근한", "전문적인")
// 주의: 한 번에 하나의 이미지만 전송 (대표 이미지)
export const generateAIListing = async (
  imageFile: File,
  hint?: string,
  tone?: string
): Promise<AIGeneratedListingResponseDTO> => {
  const formData = new FormData();
  formData.append("image", imageFile); // 한글 설명: 대표 이미지만 전송

  // 한글 설명: 선택적 파라미터 추가
  if (hint) {
    formData.append("hint", hint);
  }
  if (tone) {
    formData.append("tone", tone);
  }

  const response = await api.post<AIGeneratedListingResponseDTO>(
    "/api/ai/listing",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};


// 한글 설명: 주문 생성 요청 DTO (API 스펙에 맞춤)
// API 스펙: POST /api/orders
// Authorization: Bearer {JWT 토큰}
// Content-Type: application/json
export interface CreateOrderRequestDTO {
  projectId: string | number; // 한글 설명: 프로젝트 ID (API 스펙: number, 예: 1)
  items: Array<{
    rewardId: string | number; // 한글 설명: 리워드 ID (API 스펙: number, 예: 10)
    quantity: number; // 한글 설명: 수량
    note?: string | null; // 한글 설명: 리워드별 메모 (예: "빨간색으로 부탁드립니다", null 가능)
  }>;
  // 한글 설명: 배송 정보 (API 스펙에 맞춤)
  receiverName: string; // 한글 설명: 수령인 이름 (예: "김철수")
  receiverPhone: string; // 한글 설명: 수령인 전화번호 (예: "010-1234-5678")
  addressLine1: string; // 한글 설명: 기본 주소 (예: "서울시 강남구 테헤란로 123")
  addressLine2?: string | null; // 한글 설명: 상세 주소 (예: "456호", null 가능)
  zipCode?: string | null; // 한글 설명: 우편번호 (예: "12345", null 가능)
  // 한글 설명: 공개여부 설정 (선택적 필드, API 스펙에 포함되지 않을 수 있음)
  isNamePublic?: boolean;
  isAmountPublic?: boolean;
}

// 한글 설명: 주문 생성 응답 DTO (실제 API 응답 구조에 맞춤)
// 실제 API 응답 구조:
// {
//   "summary": {
//     "orderId": 7,
//     "orderCode": "ORD-20251117-2928E148",
//     "orderName": "펄스핏 스타터 패키지",
//     "status": "PENDING",
//     "totalAmount": 150000,
//     "projectId": 1201,
//     "createdAt": "2025-11-17T05:22:17.7956354",
//     "deliveryStatus": null
//   },
//   "items": [
//     {
//       "rewardId": 1301,
//       "rewardName": "펄스핏 스타터 패키지",
//       "rewardPrice": 150000,
//       "quantity": 1,
//       "subtotal": 150000
//     }
//   ],
//   "deliveryStartedAt": null,
//   "deliveryCompletedAt": null,
//   "confirmedAt": null
// }
// 한글 설명: 주문 요약 응답 DTO (백엔드 OrderSummaryResponse 대응)
// 주문 목록과 주문 상세에서 공통으로 사용
export interface OrderSummaryResponseDTO {
  orderId: number; // 한글 설명: 주문 PK
  orderCode: string; // 한글 설명: 주문 코드(노출용)
  projectId: number | null; // 한글 설명: 연관 프로젝트 ID
  orderName: string; // 한글 설명: 주문명(배송지 기준)
  totalAmount: number; // 한글 설명: 총 결제 금액
  status: "PENDING" | "PAID" | "CANCELLED"; // 한글 설명: 주문 상태
  deliveryStatus: string | null; // 한글 설명: 배송 상태 (백엔드 DeliveryStatus enum)
  createdAt: string; // 한글 설명: 주문 생성 시각 (ISO 8601 형식)
}

// 한글 설명: 주문 항목 응답 DTO (백엔드 OrderItemResponse 대응)
export interface OrderItemResponseDTO {
  rewardId: number | null; // 한글 설명: 리워드 ID (삭제된 경우 null)
  rewardName: string; // 한글 설명: 당시 리워드 이름
  rewardPrice: number; // 한글 설명: 당시 리워드 단가
  quantity: number; // 한글 설명: 주문 수량
  subtotal: number; // 한글 설명: 단가 * 수량
}

// 한글 설명: 배송 정보 DTO (백엔드 ShippingInfo 대응)
export interface ShippingInfoDTO {
  receiverName: string; // 한글 설명: 수령인 이름
  receiverPhone: string; // 한글 설명: 수령인 전화번호
  addressLine1: string; // 한글 설명: 주소 1
  addressLine2: string | null; // 한글 설명: 주소 2 (상세주소)
  zipCode: string; // 한글 설명: 우편번호
}

// 한글 설명: 결제 정보 DTO (백엔드 PaymentInfo 대응)
export interface PaymentInfoDTO {
  method: string | null; // 한글 설명: 결제 수단
  cardMasked: string | null; // 한글 설명: 카드 마스킹 정보
  paidAt: string | null; // 한글 설명: 결제 승인 시각 (ISO 8601 형식)
}

// 한글 설명: 배송 타임라인 DTO (백엔드 Timeline 대응)
export interface TimelineDTO {
  deliveryStartedAt: string | null; // 한글 설명: 배송 시작 시각
  deliveryCompletedAt: string | null; // 한글 설명: 배송 완료 시각
  confirmedAt: string | null; // 한글 설명: 결제 확정 시각
}

// 한글 설명: 주문 상세 응답 DTO (백엔드 OrderDetailResponse 대응)
export interface OrderDetailResponseDTO {
  summary: OrderSummaryResponseDTO; // 한글 설명: 주문 요약 정보
  shipping: ShippingInfoDTO; // 한글 설명: 배송/수령인 정보
  payment: PaymentInfoDTO | null; // 한글 설명: 결제 정보 (없을 수 있음)
  receiptUrl: string | null; // 한글 설명: 영수증 URL
  timeline: TimelineDTO; // 한글 설명: 배송 타임라인
  items: OrderItemResponseDTO[]; // 한글 설명: 주문에 포함된 리워드 항목들
}

// 한글 설명: 주문 목록 페이징 응답 DTO (백엔드 OrderPageResponse 대응)
export interface OrderListResponseDTO {
  content: OrderSummaryResponseDTO[]; // 한글 설명: 주문 목록
  page: number; // 한글 설명: 현재 페이지 (0부터 시작)
  size: number; // 한글 설명: 페이지 크기
  totalElements: number; // 한글 설명: 전체 건수
  totalPages: number; // 한글 설명: 전체 페이지 수
}

// 한글 설명: 하위 호환성을 위한 OrderResponseDTO (기존 코드와의 호환성 유지)
// 실제로는 OrderDetailResponseDTO를 사용해야 함
export type OrderResponseDTO = OrderDetailResponseDTO;

export interface ConfirmPaymentRequestDTO {
  paymentKey: string; // 한글 설명: 토스페이먼츠가 발급한 결제 고유 키
  orderId: string; // 한글 설명: 주문 고유 번호 (토스가 orderId로 전달하지만 실제 값은 orderCode)
  amount: number; // 한글 설명: 결제 금액 (검증용, 백엔드에서는 Long 타입)
}

// 한글 설명: 결제 승인 응답 DTO (백엔드 스펙에 맞춤)
// 백엔드: ConfirmPaymentResponse
// 응답: { paymentId: Long, orderId: String, paymentKey: String, method: String, amount: Long, status: String, approvedAt: LocalDateTime, receiptUrl: String }
export interface PaymentResponseDTO {
  paymentId: number; // 한글 설명: 결제 ID (백엔드에서는 Long 타입)
  orderId: string; // 한글 설명: 주문 고유 번호 (orderCode)
  paymentKey: string; // 한글 설명: 토스페이먼츠 결제 키
  method: string; // 한글 설명: 결제 수단 (예: "카드", "간편결제" 등)
  amount: number; // 한글 설명: 결제 금액 (백엔드에서는 Long 타입)
  status: string; // 한글 설명: 결제 상태 (예: "DONE", "CANCELLED", "PENDING")
  approvedAt: string; // 한글 설명: 승인 시각 (ISO 8601 형식, 백엔드에서는 LocalDateTime)
  receiptUrl?: string | null; // 한글 설명: 영수증 URL (null 가능)
}

// 한글 설명: Mock API 사용 여부 (서버가 없을 때 테스트용)
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

// 한글 설명: 주문 생성 API
// 백엔드: POST /api/orders
// 응답: OrderDetailResponse (summary, shipping, payment, receiptUrl, timeline, items)
export const createOrder = async (
  orderData: CreateOrderRequestDTO
): Promise<OrderDetailResponseDTO> => {
  if (USE_MOCK_API) {
    // 한글 설명: Mock API 사용
    const { createOrder: createOrderMock } = await import("./apiMock");
    return createOrderMock(orderData);
  }

  // 한글 설명: 실제 API 호출
  try {
    const response = await api.post<OrderDetailResponseDTO>("/api/orders", orderData);
    return response.data;
  } catch (error: unknown) {
    // 한글 설명: API 호출 실패 시 Mock API로 fallback
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.warn("⚠️ API 호출 실패, Mock API로 자동 전환:", errorMessage);
    const { createOrder: createOrderMock } = await import("./apiMock");
    return createOrderMock(orderData);
  }
};

// 한글 설명: 결제 승인 API
export const confirmPayment = async (
  paymentData: ConfirmPaymentRequestDTO
): Promise<PaymentResponseDTO> => {
  // 한글 설명: Mock API 사용 (주석처리)
  // if (USE_MOCK_API) {
  //   // 한글 설명: Mock API 사용
  //   const { confirmPayment: confirmPaymentMock } = await import("./apiMock");
  //   return confirmPaymentMock(paymentData);
  // }

  // 한글 설명: 실제 API 호출
  // 백엔드 API: POST /api/payments/confirm
  // body: { paymentKey, orderId, amount }
  const response = await api.post<PaymentResponseDTO>(
    "/api/payments/confirm",
    paymentData
  );
  return response.data;
};

// 한글 설명: 주문 목록 조회 API
// API 스펙: GET /api/orders?page={page}&size={size}
// Authorization: Bearer {JWT 토큰}
// 권한: USER (본인 주문만 조회 가능)
export const getOrders = async (
  page: number = 0,
  size: number = 20
): Promise<OrderListResponseDTO> => {
  if (USE_MOCK_API) {
    // 한글 설명: Mock API 사용
    console.log("[getOrders] Mock API 사용");
    const { getOrders: getOrdersMock } = await import("./apiMock");
    return getOrdersMock(page, size);
  }

  // 한글 설명: 실제 API 호출
  console.log("[getOrders] 백엔드 API 호출:", `/api/orders?page=${page}&size=${size}`);
  try {
    const response = await api.get<OrderListResponseDTO>("/api/orders", {
      params: { page, size },
    });
    console.log("[getOrders] 백엔드 API 응답:", response.data);
    return response.data;
  } catch (error: unknown) {
    // 한글 설명: API 호출 실패 시 에러를 그대로 throw (Mock API로 fallback하지 않음)
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("❌ [getOrders] API 호출 실패:", errorMessage, error);
    throw error; // 한글 설명: 에러를 다시 throw하여 상위에서 처리하도록 함
  }
};

// 한글 설명: 주문 상세 조회 API
// API 스펙: GET /api/orders/{orderId}
// Authorization: Bearer {JWT 토큰}
// 권한: USER (본인만 조회 가능)
// 응답: OrderDetailResponse (summary, shipping, payment, receiptUrl, timeline, items)
export const getOrder = async (orderId: number): Promise<OrderDetailResponseDTO> => {
  if (USE_MOCK_API) {
    // 한글 설명: Mock API 사용
    console.log("[getOrder] Mock API 사용");
    const { getOrder: getOrderMock } = await import("./apiMock");
    return getOrderMock(String(orderId));
  }

  // 한글 설명: 실제 API 호출
  console.log("[getOrder] 백엔드 API 호출:", `/api/orders/${orderId}`);
  try {
    const response = await api.get<OrderDetailResponseDTO>(`/api/orders/${orderId}`);
    console.log("[getOrder] 백엔드 API 응답:", response.data);
    return response.data;
  } catch (error: unknown) {
    // 한글 설명: API 호출 실패 시 에러를 그대로 throw (Mock API로 fallback하지 않음)
    const errorMessage =
      error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("❌ [getOrder] API 호출 실패:", errorMessage, error);
    throw error; // 한글 설명: 에러를 다시 throw하여 상위에서 처리하도록 함
  }
};

export default api;