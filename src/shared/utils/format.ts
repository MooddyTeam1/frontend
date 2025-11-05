export const currencyKRW = (n: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(n);

export const daysLeft = (endISO: string) => {
  const diff = new Date(endISO).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const progressPct = (raised: number, goal: number) => {
  if (!goal) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
};
