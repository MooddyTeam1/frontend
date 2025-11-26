// 한글 설명: 결제 성공 페이지. 토스페이먼츠 결제 승인 후 리다이렉트되는 페이지
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { confirmPayment, type PaymentResponseDTO, type OrderSummaryResponseDTO } from "../../services/api";
import { currencyKRW } from "../../shared/utils/format";

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "fail">(
    "loading"
  );
  const [paymentData, setPaymentData] = useState<PaymentResponseDTO | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // 한글 설명: 토스가 리다이렉트하면서 전달한 파라미터들
  // 주의: orderId 파라미터에는 실제로 orderCode가 들어옴 (토스페이먼츠 요구사항)
  const paymentKey = searchParams.get("paymentKey");
  const orderCode = searchParams.get("orderId"); // 한글 설명: 토스가 orderId로 전달하지만 실제 값은 orderCode
  const amount = searchParams.get("amount");

  // 한글 설명: 결제 승인 요청
  useEffect(() => {
    async function approvePayment() {
      try {
        if (!paymentKey || !orderCode || !amount) {
          setStatus("fail");
          setError("결제 정보가 올바르지 않습니다.");
          return;
        }

        console.log("결제 승인 요청:", {
          paymentKey,
          orderId: orderCode,
          amount,
        });

        // 한글 설명: 백엔드에 승인 API 호출 (필수!)
        // 백엔드 API: POST /api/payments/confirm
        // body: { paymentKey, orderId, amount }
        // 주의: orderId 파라미터에는 실제로 orderCode 값이 들어감 (토스페이먼츠 요구사항)
        const response = await confirmPayment({
          paymentKey,
          orderId: orderCode, // 한글 설명: 백엔드 스펙에 맞춰 orderId로 전달 (실제 값은 orderCode)
          amount: Number(amount),
        });

        console.log("결제 승인 완료:", response);
        setStatus("success");
        setPaymentData(response);
      } catch (err: unknown) {
        console.error("❌ 결제 승인 실패:", err);

        // 한글 설명: 에러 타입에 따른 처리
        const errorObj = err as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
            status?: number;
          };
          message?: string;
        };

        // 한글 설명: 백엔드에서 전달한 에러 메시지 추출
        const errorMessage =
          errorObj.response?.data?.message ||
          errorObj.response?.data?.error ||
          errorObj.message ||
          "결제 승인에 실패했습니다.";

        // 한글 설명: HTTP 상태 코드 확인
        const statusCode = errorObj.response?.status;
        console.error("  - HTTP 상태 코드:", statusCode);
        console.error("  - 에러 메시지:", errorMessage);

        setStatus("fail");
        setError(errorMessage);
      }
    }

    approvePayment();
  }, [paymentKey, orderCode, amount]);

  // 한글 설명: 로딩 중
  if (status === "loading") {
    return (
      <Container>
        <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center space-y-6 py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900"></div>
          <h2 className="text-xl font-semibold text-neutral-900">
            결제 승인 처리 중...
          </h2>
          <p className="text-sm text-neutral-500">잠시만 기다려주세요.</p>
        </div>
      </Container>
    );
  }

  // 한글 설명: 승인 실패
  if (status === "fail") {
    return (
      <Container>
        <div className="mx-auto min-h-[60vh] max-w-2xl space-y-8 py-16 text-center">
          <div className="text-6xl">❌</div>
          <h1 className="text-3xl font-semibold text-red-600">
            결제 승인 실패
          </h1>
          <p className="text-sm text-neutral-600">{error}</p>
          <p className="text-sm text-neutral-500">
            결제 처리 중 오류가 발생했습니다.
          </p>
          <p className="text-sm text-neutral-500">관리자에게 문의해주세요.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-full border border-neutral-900 px-6 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white"
            >
              다시 시도
            </button>
            <button
              onClick={() => navigate("/")}
              className="rounded-full border border-neutral-200 px-6 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
            >
              홈으로
            </button>
          </div>
        </div>
      </Container>
    );
  }

  // 한글 설명: 승인 성공
  if (!paymentData) return null;

  return (
    <Container>
      <div className="mx-auto min-h-[60vh] max-w-2xl space-y-8 py-16 text-center">
        <div className="text-6xl">🎉</div>
        <h1 className="text-3xl font-semibold text-neutral-900">결제 완료!</h1>
        <p className="text-sm text-neutral-600">
          펀딩에 성공적으로 참여하셨습니다.
        </p>

        {/* 한글 설명: 결제 정보 */}
        <section className="space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-left">
          <h3 className="text-lg font-semibold text-neutral-900">결제 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">주문번호</span>
              <span className="font-medium text-neutral-900">
                {paymentData.orderId}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">결제금액</span>
              <span className="font-semibold text-neutral-900">
                {currencyKRW(paymentData.amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">결제수단</span>
              <span className="font-medium text-neutral-900">
                {paymentData.method}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">승인시각</span>
              <span className="font-medium text-neutral-900">
                {new Date(paymentData.approvedAt).toLocaleString("ko-KR")}
              </span>
            </div>
          </div>
        </section>

        {/* 한글 설명: 영수증 링크 */}
        {paymentData.receiptUrl ? (
          <a
            href={paymentData.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-neutral-200 bg-white px-6 py-2 text-sm text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            📄 영수증 보기
          </a>
        ) : (
          <p className="text-xs text-neutral-500">
            💡 테스트 환경에서는 영수증이 제공되지 않습니다. 라이브 환경에서
            확인하세요.
          </p>
        )}

        {/* 한글 설명: 버튼 */}
        <div className="flex justify-center gap-3">
          <button
            onClick={async () => {
              // 한글 설명: paymentData.orderId는 실제로는 orderCode입니다
              // 주문 목록에서 orderCode로 orderId를 찾아서 상세보기로 이동
              try {
                const { getOrders } = await import("../../services/api");
                const orderList = await getOrders(0, 100);
                const foundOrder = orderList.content.find(
                  (o: OrderSummaryResponseDTO) =>
                    o.orderCode === paymentData.orderId
                );

                if (foundOrder) {
                  const orderId = foundOrder.orderId ?? 0;
                  navigate(`/orders/${orderId}`);
                } else {
                  // 한글 설명: 주문을 찾을 수 없으면 주문 목록으로 이동
                  navigate("/profile/supporter/orders");
                }
              } catch (err) {
                console.error("주문 상세보기 이동 실패", err);
                // 한글 설명: 실패 시 주문 목록으로 이동
                navigate("/profile/supporter/orders");
              }
            }}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            주문 상세 보기
          </button>
          <button
            onClick={() => navigate("/")}
            className="rounded-full border border-neutral-200 px-6 py-2 text-sm text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"
          >
            홈으로
          </button>
        </div>
      </div>
    </Container>
  );
};
