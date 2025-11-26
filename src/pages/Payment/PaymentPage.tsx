// 한글 설명: 토스페이먼츠 결제 페이지. 주문 생성 후 결제를 진행하는 페이지
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { currencyKRW } from "../../shared/utils/format";
import { getOrder, type OrderResponseDTO } from "../../services/api";
import { requestTossPayment } from "../../shared/utils/payment";

// 한글 설명: 토스페이먼츠 클라이언트 키 (결제창 SDK용)
// 주의: 결제창 SDK 방식은 위젯 키(test_gck_)가 아닌 일반 클라이언트 키(test_ck_)도 사용 가능
const clientKey =
  import.meta.env.VITE_TOSS_CLIENT_KEY ||
  import.meta.env.VITE_TOSS_WIDGET_CLIENT_KEY ||
  "";

export const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 한글 설명: 결제 처리 중 상태 (중복 클릭 방지)
  const [isProcessing, setIsProcessing] = useState(false);

  // 한글 설명: 주문 정보 상태 (PledgePage에서 전달받거나 API로 조회)
  const [order, setOrder] = useState<OrderResponseDTO | null>(
    (location.state?.order as OrderResponseDTO | undefined) || null
  );
  // 한글 설명: 주문 로딩 중 여부
  const [loadingOrder, setLoadingOrder] = useState(false);
  // 한글 설명: 주문 로드 에러
  const [orderError, setOrderError] = useState<string | null>(null);

  // 한글 설명: 클라이언트 키가 없거나 기본값인 경우 Mock 결제 모드
  // 주의: 결제창 SDK 방식은 위젯 키 없이도 일반 클라이언트 키로 사용 가능
  const isMockMode = !clientKey || clientKey === "test_ck_xxxxxxxxx";

  // 한글 설명: 주문 상세 조회 (location.state에 주문 정보가 없을 때 orderId로 조회)
  useEffect(() => {
    // 한글 설명: 이미 주문 정보가 있으면 조회하지 않음
    if (order) {
      console.log("✅ 주문 정보가 이미 있습니다. API 호출을 건너뜁니다.");
      return;
    }

    // 한글 설명: orderId 추출 순서:
    // 1. location.state에서 orderId 추출 (PledgePage에서 전달한 경우)
    // 2. URL 파라미터에서 orderId 추출 (직접 접근한 경우, 예: /payment?orderId=5)
    const orderIdFromState = location.state?.orderId as number | undefined;
    const orderIdFromUrl = searchParams.get("orderId");

    // 한글 설명: orderId를 number로 변환
    let orderId: number | undefined;
    if (orderIdFromState) {
      orderId = orderIdFromState;
      console.log("📍 location.state에서 orderId 추출:", orderId);
    } else if (orderIdFromUrl) {
      const parsedOrderId = Number.parseInt(orderIdFromUrl, 10);
      if (!Number.isNaN(parsedOrderId)) {
        orderId = parsedOrderId;
        console.log("📍 URL 파라미터에서 orderId 추출:", orderId);
      }
    }

    if (!orderId) {
      console.error("❌ 주문 ID가 없습니다.");
      console.error("  - location.state?.orderId:", orderIdFromState);
      console.error("  - URL 파라미터 orderId:", orderIdFromUrl);
      setOrderError("주문 정보가 없습니다.");
      alert("주문 정보가 없습니다. 다시 시도해주세요.");
      navigate("/projects");
      return;
    }

    // 한글 설명: 주문 상세 조회 API 호출
    // API: GET /api/orders/{orderId}
    // 권한: USER (본인만 조회 가능)
    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);
        setOrderError(null);

        console.log("🔄 주문 상세 조회 API 호출:", { orderId });
        const orderData = await getOrder(orderId);
        console.log("✅ 주문 상세 조회 완료:", orderData);
        console.log(
          "  - 주문 ID:",
          orderData.summary?.orderId || orderData.orderId
        );
        console.log(
          "  - 주문 코드:",
          orderData.summary?.orderCode || orderData.orderCode
        );
        console.log(
          "  - 총 금액:",
          orderData.summary?.totalAmount || orderData.totalAmount
        );
        console.log(
          "  - 주문 상태:",
          orderData.summary?.status || orderData.status
        );
        console.log("  - 항목 수:", orderData.items?.length || 0);

        setOrder(orderData);
      } catch (err: unknown) {
        console.error("❌ 주문 상세 조회 실패:", err);

        // 한글 설명: 에러 타입 처리
        const errorObj = err as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };

        console.error("  - 에러 응답:", errorObj.response?.data);
        console.error("  - 상태 코드:", errorObj.response?.status);

        const errorMessage =
          errorObj.response?.data?.message ||
          errorObj.message ||
          "주문 정보를 불러올 수 없습니다.";

        setOrderError(errorMessage);

        // 한글 설명: 인증 에러인 경우 로그인 페이지로 이동
        if (errorObj.response?.status === 401) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // 한글 설명: 404 에러인 경우 (주문을 찾을 수 없음)
        if (errorObj.response?.status === 404) {
          alert("주문을 찾을 수 없습니다.");
          navigate("/projects");
          return;
        }

        alert(errorMessage);
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, searchParams]); // 한글 설명: order가 있으면 조회하지 않으므로 의존성에서 제외

  // 한글 설명: Mock 결제 (토스 위젯 없이 테스트)
  const handleMockPayment = async () => {
    if (!order) return;

    // 한글 설명: Mock 결제 승인을 위해 결제 성공 페이지로 직접 이동
    // 주의: 토스가 리다이렉트할 때 orderId 파라미터에는 orderCode가 들어감
    const orderCode = order.summary?.orderCode || order.orderCode;
    const totalAmount = order.summary?.totalAmount || order.totalAmount;
    const mockPaymentKey = `mock_payment_${Date.now()}`;
    const successUrl = `/payment/success?paymentKey=${mockPaymentKey}&orderId=${orderCode}&amount=${totalAmount}`;
    navigate(successUrl);
  };

  // 한글 설명: 결제 요청 (토스페이먼츠) - 결제창 SDK 방식 사용
  const handlePayment = async () => {
    if (!order) {
      alert("주문 정보가 없습니다.");
      return;
    }

    // 한글 설명: 이미 결제 처리 중일 때
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // 한글 설명: 주문 정보 추출 (summary 객체가 있으면 summary에서, 없으면 직접 접근)
      const orderCode = order.summary?.orderCode || order.orderCode || "";
      const orderName = order.summary?.orderName || order.orderName || "주문";
      const totalAmount = order.summary?.totalAmount || order.totalAmount || 0;

      // 한글 설명: 필수 값 검증
      if (!orderCode) {
        alert("주문 코드가 없습니다.");
        return;
      }

      if (totalAmount <= 0) {
        alert("결제 금액이 올바르지 않습니다.");
        return;
      }

      console.log("결제 요청 시작:", {
        orderCode,
        orderName,
        totalAmount,
      });

      // 한글 설명: 결제창 SDK 방식으로 결제 요청 (위젯 키 필요 없음)
      await requestTossPayment({
        orderCode, // 한글 설명: 주문 코드
        amount: totalAmount, // 한글 설명: 결제 금액
        orderName, // 한글 설명: 주문명
      });

      // 한글 설명: requestPayment 호출 후에는 토스페이먼츠 결제 팝업/모달이 표시됩니다.
      // 사용자가 결제 정보를 입력하고 결제를 완료하면 successUrl 또는 failUrl로 리다이렉트됩니다.
      console.log("✅ 결제 요청 완료 - 토스페이먼츠 결제 창이 열립니다.");

      // 주의: requestPayment가 성공하면 페이지가 리다이렉트되므로 이 코드 아래는 실행되지 않을 수 있음
      setIsProcessing(false);
    } catch (error: unknown) {
      console.error("❌ 결제 요청 실패:", error);
      setIsProcessing(false);

      // 한글 설명: 에러 타입에 따른 처리
      const errorObj = error as { code?: string; message?: string };

      // 한글 설명: 사용자가 결제를 취소한 경우
      if (errorObj.code === "USER_CANCEL") {
        alert("결제를 취소하셨습니다.");
        return;
      }

      // 한글 설명: 기타 에러
      const errorMessage =
        errorObj.message || "알 수 없는 오류가 발생했습니다.";
      alert(`결제 요청에 실패했습니다: ${errorMessage}`);

      console.error("⚠️ 결제 요청 에러:", errorMessage);
    }
  };

  // 한글 설명: 디버깅을 위한 Mock 모드 상태 로그
  useEffect(() => {
    if (!order) return;

    console.log("🔍 결제 모드 상태 체크:");
    console.log("  - clientKey 존재:", !!clientKey);
    console.log("  - isMockMode:", isMockMode);
    if (isMockMode) {
      console.log(
        "⚠️ Mock 모드로 실행 중입니다. 토스페이먼츠 클라이언트 키가 설정되지 않았습니다."
      );
      if (!clientKey) {
        console.log("  원인: 클라이언트 키가 없습니다");
      } else if (clientKey === "test_ck_xxxxxxxxx") {
        console.log("  원인: 기본값 클라이언트 키입니다");
      }
      console.log(
        "💡 해결 방법: .env 파일에 VITE_TOSS_CLIENT_KEY를 설정하세요"
      );
    } else {
      console.log(
        "✅ 정상 모드로 실행 중입니다. 결제하기 버튼을 클릭하면 결제창이 열립니다."
      );
      console.log("  - 결제창 SDK 방식 사용 (위젯 키 불필요)");
    }
  }, [order, isMockMode]);

  // 한글 설명: 주문 정보 로딩 중
  if (loadingOrder) {
    return (
      <Container>
        <div className="mx-auto min-h-[60vh] max-w-2xl space-y-8 py-16 text-center">
          <div className="text-6xl">⏳</div>
          <h1 className="text-3xl font-semibold text-neutral-900">
            주문 정보 불러오는 중...
          </h1>
          <p className="text-sm text-neutral-600">잠시만 기다려주세요.</p>
        </div>
      </Container>
    );
  }

  // 한글 설명: 주문 정보 없음 또는 에러
  if (!order || orderError) {
    return (
      <Container>
        <div className="mx-auto min-h-[60vh] max-w-2xl space-y-8 py-16 text-center">
          <div className="text-6xl">❌</div>
          <h1 className="text-3xl font-semibold text-neutral-900">
            주문 정보를 불러올 수 없습니다
          </h1>
          <p className="text-sm text-neutral-600">
            {orderError || "주문 정보가 없습니다."}
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => navigate("/projects")}
              className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              프로젝트 목록으로
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="mx-auto min-h-[60vh] max-w-2xl space-y-8 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
            Payment
          </p>
          <h1 className="text-3xl font-semibold text-neutral-900">결제하기</h1>
        </header>

        {/* 한글 설명: 주문 정보 */}
        <section className="space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <h3 className="text-lg font-semibold text-neutral-900">주문 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">주문번호</span>
              <span className="font-medium text-neutral-900">
                {/* 한글 설명: summary 객체가 있으면 summary.orderCode 사용, 없으면 직접 접근 */}
                {order.summary?.orderCode ||
                  order.orderCode ||
                  order.summary?.orderId ||
                  order.orderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">주문명</span>
              <span className="font-medium text-neutral-900">
                {order.summary?.orderName || "주문명 없음"}
              </span>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2">
              <span className="text-lg font-semibold text-neutral-900">
                결제금액
              </span>
              <span className="text-lg font-semibold text-neutral-900">
                {currencyKRW(
                  order.summary?.totalAmount || 0
                )}
              </span>
            </div>
          </div>
        </section>

        {/* 한글 설명: Mock 모드 안내 */}
        {isMockMode && (
          <div className="space-y-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-800">
            <p className="font-semibold">🧪 Mock 결제 모드</p>
            <p className="text-yellow-700">
              서버 없이 테스트 중입니다. 아래 "Mock 결제하기" 버튼을 클릭하면
              결제 성공 페이지로 이동합니다.
            </p>
            <div className="rounded-xl border border-yellow-300 bg-white p-3 text-yellow-900">
              <p className="font-semibold">
                ⚠️ 토스페이먼츠 결제창 사용하려면:
              </p>
              <ol className="mt-2 space-y-1 text-yellow-800">
                <li>1. 토스페이먼츠 개발자센터 접속</li>
                <li>2. 상점 선택 → "API 키" 메뉴</li>
                <li>
                  3. <strong>"클라이언트 키"</strong> 확인 (test_ck_로 시작)
                </li>
                <li>
                  4. .env 파일에 추가:{" "}
                  <code className="rounded bg-yellow-100 px-1">
                    VITE_TOSS_CLIENT_KEY=test_ck_xxxxx
                  </code>
                </li>
                <li className="mt-2 text-yellow-700">
                  💡 결제창 SDK 방식은 위젯 키(test_gck_) 없이도 일반 클라이언트
                  키(test_ck_)로 사용 가능합니다!
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* 한글 설명: 결제창 SDK 방식은 위젯 렌더링이 필요 없음 */}
        {/* 결제하기 버튼을 클릭하면 바로 결제창 팝업이 열림 */}

        {/* 한글 설명: 결제 버튼 */}
        {isMockMode ? (
          <button
            onClick={handleMockPayment}
            className="w-full rounded-full border border-neutral-900 bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            🧪 Mock 결제하기 (
            {currencyKRW(order.summary?.totalAmount || order.totalAmount || 0)})
          </button>
        ) : (
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full rounded-full border border-neutral-900 bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed"
          >
            {isProcessing
              ? "결제 처리 중..."
              : `${currencyKRW(order.summary?.totalAmount || order.totalAmount || 0)} 결제하기`}
          </button>
        )}
      </div>
    </Container>
  );
};
