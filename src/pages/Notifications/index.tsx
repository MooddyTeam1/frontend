// 한글 설명: 알림 전체 보기 페이지
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "../../shared/components/Container";
import { useNotificationStore } from "../../features/notifications/stores/notificationStore";
import type {
  NotificationResponse,
  NotificationTargetType,
  NotificationType,
} from "../../features/notifications/types";

/**
 * 한글 설명: 알림 전체 보기 페이지
 * - 메이커/서포터 탭으로 분리하여 알림 목록 표시
 * - 읽음 처리 기능
 * - 알림 클릭 시 해당 페이지로 이동
 */
export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  // 한글 설명: 현재 선택된 탭 (maker 또는 supporter)
  const [activeTab, setActiveTab] = useState<"maker" | "supporter">("maker");

  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  } = useNotificationStore();

  // 한글 설명: 컴포넌트 마운트 시 알림 목록 불러오기
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // 한글 설명: 현재 탭에 맞는 알림 목록 필터링
  const filteredNotifications = useMemo(() => {
    const targetType: NotificationType =
      activeTab === "maker" ? "MAKER" : "SUPPORTER";
    return notifications.filter((n) => n.type === targetType);
  }, [notifications, activeTab]);

  // 한글 설명: 메이커 탭의 읽지 않은 알림 개수
  const makerUnreadCount = useMemo(() => {
    return notifications.filter(
      (n) => n.type === "MAKER" && !n.read
    ).length;
  }, [notifications]);

  // 한글 설명: 서포터 탭의 읽지 않은 알림 개수
  const supporterUnreadCount = useMemo(() => {
    return notifications.filter(
      (n) => n.type === "SUPPORTER" && !n.read
    ).length;
  }, [notifications]);

  /**
   * 한글 설명: 알림 클릭 핸들러
   * - 알림 타입에 따라 해당 페이지로 이동
   * - 읽지 않은 알림은 읽음 처리
   */
  const handleNotificationClick = async (
    notification: NotificationResponse
  ) => {
    // 한글 설명: 읽지 않은 알림은 읽음 처리
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    // 한글 설명: 알림 타입에 따라 페이지 이동
    const targetUrl = getNotificationTargetUrl(
      notification.targetType,
      notification.targetId
    );

    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  /**
   * 한글 설명: 알림 타입에 따른 URL 생성
   */
  const getNotificationTargetUrl = (
    targetType: NotificationTargetType,
    targetId: number
  ): string | null => {
    switch (targetType) {
      case "PROJECT":
        return `/projects/${targetId}`;
      case "NEWS":
        // 한글 설명: NEWS는 프로젝트 ID를 포함할 수 있음 (백엔드 구조에 따라 조정 필요)
        return `/projects/${targetId}`;
      case "ORDER":
        return `/orders/${targetId}`;
      case "SETTLEMENT":
        return `/settlements/${targetId}`;
      case "MAKER":
        return `/makers/${targetId}`;
      default:
        return null;
    }
  };

  /**
   * 한글 설명: 날짜 포맷팅 유틸 함수
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  /**
   * 한글 설명: 현재 탭의 전체 읽음 처리 핸들러
   */
  const handleMarkAllAsRead = async () => {
    try {
      // 한글 설명: 현재 탭의 읽지 않은 알림만 읽음 처리
      const unreadInCurrentTab = filteredNotifications.filter((n) => !n.read);
      await Promise.all(
        unreadInCurrentTab.map((n) => markAsRead(n.id))
      );
    } catch (error) {
      console.error("전체 읽음 처리 실패:", error);
      alert("전체 읽음 처리에 실패했습니다.");
    }
  };

  // 한글 설명: 현재 탭의 읽지 않은 알림 개수
  const currentTabUnreadCount =
    activeTab === "maker" ? makerUnreadCount : supporterUnreadCount;

  return (
    <Container>
      <div className="mx-auto min-h-[70vh] max-w-4xl py-16">
        {/* 한글 설명: 헤더 */}
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold text-neutral-900">알림 센터</h1>
          <p className="text-sm text-neutral-500">
            후원 결제, 배송 업데이트, 마감 임박 알림을 한 곳에서 확인하세요.
          </p>
        </div>

        {/* 한글 설명: 탭 네비게이션 */}
        <div className="mb-6 flex gap-2 border-b border-neutral-200">
          <button
            type="button"
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
            type="button"
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

        {/* 한글 설명: 헤더 액션 버튼 */}
        {currentTabUnreadCount > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
            >
              전체 읽음
            </button>
          </div>
        )}

        {/* 한글 설명: 알림 목록 */}
        {loading ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-sm text-neutral-500">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-sm text-neutral-500">
              {activeTab === "maker"
                ? "메이커 전용 알림이 없습니다."
                : "서포터 전용 알림이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className={`w-full rounded-2xl border px-6 py-4 text-left transition hover:shadow-md ${
                  !notification.read
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 한글 설명: 읽지 않은 알림 표시 점 */}
                  {!notification.read && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-base font-medium ${
                            !notification.read
                              ? "text-neutral-900"
                              : "text-neutral-600"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-neutral-400">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      {/* 한글 설명: 알림 타입 뱃지 */}
                      <div className="shrink-0">
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">
                          {getNotificationTypeLabel(notification.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
};

/**
 * 한글 설명: 알림 타입에 따른 라벨 반환
 */
const getNotificationTypeLabel = (type: string): string => {
  switch (type) {
    case "SUPPORTER":
      return "서포터";
    case "MAKER":
      return "메이커";
    case "ADMIN":
      return "관리자";
    default:
      return type;
  }
};

