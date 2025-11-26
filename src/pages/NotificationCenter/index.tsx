// 한글 설명: 알림 센터 페이지. 메이커 전용/서포터 전용 탭으로 분리
import React, { useState, useMemo } from "react";
import { Container } from "../../shared/components/Container";

// 한글 설명: 알림 타입 정의
interface Notification {
  title: string;
  body: string;
  ts: string;
  type: "success" | "warning" | "info";
  read?: boolean; // 한글 설명: 읽음 여부
}

// 한글 설명: 메이커 전용 알림 목록 (예: 프로젝트 승인, 후원 알림 등)
const makerNotifications: Notification[] = [
  {
    title: "프로젝트 승인 완료",
    body: "Smart LED Lamp 프로젝트가 승인되어 공개되었습니다.",
    ts: "2025-11-03 14:21",
    type: "success",
    read: false,
  },
  {
    title: "새로운 후원",
    body: "Compact Coffee Kit 프로젝트에 새로운 후원이 들어왔습니다.",
    ts: "2025-11-02 09:00",
    type: "info",
    read: false,
  },
  {
    title: "목표 달성",
    body: "Pet AI Tracker 프로젝트가 목표 금액을 달성했습니다!",
    ts: "2025-11-01 16:45",
    type: "success",
    read: true,
  },
  {
    title: "마감 임박",
    body: "Smart LED Lamp 프로젝트 마감이 24시간 남았습니다.",
    ts: "2025-10-31 10:30",
    type: "warning",
    read: false,
  },
];

// 한글 설명: 서포터 전용 알림 목록 (예: 결제 성공, 배송 안내 등)
const supporterNotifications: Notification[] = [
  {
    title: "결제 성공",
    body: "Compact Coffee Kit 리워드 결제가 완료되었습니다.",
    ts: "2025-11-03 14:21",
    type: "success",
    read: false,
  },
  {
    title: "배송 안내",
    body: "Pet AI Tracker 리워드가 배송 준비 중입니다.",
    ts: "2025-11-01 16:45",
    type: "info",
    read: false,
  },
  {
    title: "마감 임박",
    body: "Smart LED Lamp 프로젝트 마감이 24시간 남았습니다.",
    ts: "2025-11-02 09:00",
    type: "warning",
    read: true,
  },
];

const typeBadge: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-600",
  warning: "bg-amber-500/10 text-amber-600",
  info: "bg-blue-500/10 text-blue-600",
};

export const NotificationCenterPage: React.FC = () => {
  // 한글 설명: 현재 선택된 탭 (maker 또는 supporter)
  const [activeTab, setActiveTab] = useState<"maker" | "supporter">("maker");

  // 한글 설명: 현재 탭에 맞는 알림 목록
  const currentNotifications = useMemo(() => {
    return activeTab === "maker" ? makerNotifications : supporterNotifications;
  }, [activeTab]);

  // 한글 설명: 메이커 탭의 읽지 않은 알림 개수
  const makerUnreadCount = useMemo(() => {
    return makerNotifications.filter((n) => !n.read).length;
  }, []);

  // 한글 설명: 서포터 탭의 읽지 않은 알림 개수
  const supporterUnreadCount = useMemo(() => {
    return supporterNotifications.filter((n) => !n.read).length;
  }, []);

  return (
    <Container>
      <div className="space-y-6 py-16">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">알림 센터</h1>
          <p className="text-sm text-neutral-500">
            후원 결제, 배송 업데이트, 마감 임박 알림을 한 곳에서 확인하세요.
          </p>
        </header>

        {/* 한글 설명: 탭 네비게이션 */}
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab("maker")}
            className={`relative border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "maker"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            메이커 전용
            {makerUnreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                {makerUnreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("supporter")}
            className={`relative border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "supporter"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-900"
            }`}
          >
            서포터 전용
            {supporterUnreadCount > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                {supporterUnreadCount}
              </span>
            )}
          </button>
        </div>

        {/* 한글 설명: 알림 목록 */}
        <section className="space-y-3 rounded-3xl border border-neutral-200 p-6">
          {currentNotifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-neutral-500">
              알림이 없습니다.
            </div>
          ) : (
            currentNotifications.map((item, index) => (
              <article
                key={`${item.ts}-${index}`}
                className={`flex flex-col gap-2 rounded-2xl border p-4 ${
                  !item.read
                    ? "border-neutral-200 bg-neutral-50"
                    : "border-neutral-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-neutral-900">
                      {item.title}
                    </h2>
                    {!item.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] ${
                      typeBadge[item.type] ?? "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">{item.body}</p>
                <span className="text-xs text-neutral-400">{item.ts}</span>
              </article>
            ))
          )}
        </section>
      </div>
    </Container>
  );
};
