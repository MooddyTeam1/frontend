// 한글 설명: 결제 실패 페이지. 토스페이먼츠 결제 실패 시 리다이렉트되는 페이지
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";

export const PaymentFailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 한글 설명: 토스가 리다이렉트하면서 전달한 에러 정보
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <Container>
      <div className="mx-auto min-h-[60vh] max-w-2xl space-y-8 py-16 text-center">
        <div className="text-6xl">❌</div>
        <h1 className="text-3xl font-semibold text-red-600">결제 실패</h1>
        <p className="text-sm text-neutral-600">
          결제 처리 중 문제가 발생했습니다.
        </p>

        {/* 한글 설명: 에러 정보 */}
        <section className="space-y-4 rounded-3xl border border-red-200 bg-red-50 p-6 text-left">
          <h3 className="text-lg font-semibold text-red-900">오류 정보</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">오류 코드</span>
              <span className="font-medium text-neutral-900">{code || "알 수 없음"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">오류 메시지</span>
              <span className="font-medium text-neutral-900">
                {message || "알 수 없는 오류가 발생했습니다."}
              </span>
            </div>
            {orderId && (
              <div className="flex justify-between">
                <span className="text-neutral-500">주문번호</span>
                <span className="font-medium text-neutral-900">{orderId}</span>
              </div>
            )}
          </div>
        </section>

        {/* 한글 설명: 일반적인 실패 사유 안내 */}
        <section className="space-y-3 rounded-3xl border border-neutral-200 bg-neutral-50 p-6 text-left">
          <h4 className="font-semibold text-neutral-900">일반적인 실패 사유:</h4>
          <ul className="space-y-1 text-sm text-neutral-600">
            <li>• 카드 한도 초과</li>
            <li>• 잔액 부족</li>
            <li>• 카드 정보 불일치</li>
            <li>• 일시적인 네트워크 오류</li>
          </ul>
        </section>

        {/* 한글 설명: 버튼 */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-neutral-900 bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800"
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
};





