// 한글 설명: 알림 아이콘 컴포넌트 (헤더에 표시)
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../stores/notificationStore";

/**
 * 한글 설명: 알림 벨 아이콘 컴포넌트
 * - 읽지 않은 알림 개수를 배지로 표시
 * - 클릭 시 알림 페이지로 이동
 */
export const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  // 한글 설명: 컴포넌트 마운트 시 읽지 않은 알림 개수 불러오기
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      className="relative rounded-full p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
      aria-label="알림"
    >
      {/* 한글 설명: 벨 아이콘 (SVG) */}
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      {/* 한글 설명: 읽지 않은 알림 개수 배지 */}
      {unreadCount > 0 && (
        <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

