import React from "react";
import { Container } from "../../shared/components/Container";

const notifications = [
  {
    title: "결제 성공",
    body: "Compact Coffee Kit 리워드 결제가 완료되었습니다.",
    ts: "2025-11-03 14:21",
    type: "success",
  },
  {
    title: "마감 임박",
    body: "Smart LED Lamp 프로젝트 마감이 24시간 남았습니다.",
    ts: "2025-11-02 09:00",
    type: "warning",
  },
  {
    title: "배송 안내",
    body: "Pet AI Tracker 리워드가 배송 준비 중입니다.",
    ts: "2025-11-01 16:45",
    type: "info",
  },
];

const typeBadge: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  info: "bg-blue-500/10 text-blue-600",
};

export const NotificationCenterPage: React.FC = () => (
  <Container>
    <div className="space-y-6 py-16">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">알림 센터</h1>
        <p className="text-sm text-neutral-500">
          후원 결제, 배송 업데이트, 마감 임박 알림을 한 곳에서 확인하세요. 읽음 처리는 곧 추가될 예정입니다.
        </p>
      </header>

      <section className="space-y-3 rounded-3xl border border-neutral-200 p-6">
        {notifications.map((item) => (
          <article key={item.ts} className="flex flex-col gap-2 rounded-2xl border border-neutral-100 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">{item.title}</h2>
              <span className={`rounded-full px-2 py-1 text-[11px] ${typeBadge[item.type] ?? "bg-neutral-100 text-neutral-500"}`}>
                {item.type.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-neutral-600">{item.body}</p>
            <span className="text-xs text-neutral-400">{item.ts}</span>
          </article>
        ))}
      </section>
    </div>
  </Container>
);
