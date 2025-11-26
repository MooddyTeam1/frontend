// 한글 설명: 숫자를 한국 원화 형식으로 포맷팅 (예: 1000000 -> "₩1,000,000")
export const currencyKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);

// 한글 설명: 종료일까지 남은 일수 계산 (ISO 날짜 문자열을 받아서 오늘부터 종료일까지의 일수 반환)
export const daysLeft = (endISO: string) => {
  const diff = new Date(endISO).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// 한글 설명: 모금 진행률을 퍼센트로 계산 (0~100 사이 값 반환, 목표 금액이 0이면 0 반환)
export const progressPct = (raised: number, goal: number) => {
  if (!goal) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
};
