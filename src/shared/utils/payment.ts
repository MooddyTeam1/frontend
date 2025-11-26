// 한글 설명: 토스페이먼츠 결제창 SDK 유틸 함수
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

// 한글 설명: 결제창 SDK를 이용해 토스 결제창을 띄우는 함수
export async function requestTossPayment(opts: {
  orderCode: string;
  amount: number;
  orderName: string;
}) {
  const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY as string; // ck 키
  const customerKey = "user-" + localStorage.getItem("userId"); // 유저 식별용

  const tossPayments = await loadTossPayments(clientKey);

  // 한글 설명: SDK v2에서는 payment() 인스턴스를 생성해야 함
  const payment = tossPayments.payment({
    customerKey,
  });

  // 한글 설명: 이게 바로 '결제창 SDK' 방식. 위젯 키 필요 X
  await payment.requestPayment({
    method: "CARD", // 한글 설명: 결제수단 (카드)
    amount: {
      currency: "KRW",
      value: opts.amount,
    },
    orderId: opts.orderCode,
    orderName: opts.orderName,
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`,
  });
}

