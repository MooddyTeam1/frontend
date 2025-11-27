// 한글 설명: 알림 목록 컴포넌트 (드롭다운)
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../stores/notificationStore";
import type { NotificationResponse, NotificationTargetType } from "../types";

type NotificationListProps = {
  onClose: () => void;
};

/**
 * 한글 설명: 알림 목록 드롭다운 컴포넌트
 * - 알림 목록 표시
 * - 알림 클릭 시 해당 페이지로 이동
 * - 읽음 처리 및 전체 읽음 처리 기능
 */
export const NotificationList: React.FC<NotificationListProps> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllAsRead,
    markAsRead,
  } = useNotificationStore();

  // 한글 설명: 컴포넌트 마운트 시 알림 목록 불러오기
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
      onClose();
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
    return `${year}-${month}-${day}`;
  };

  /**
   * 한글 설명: 전체 읽음 처리 핸들러
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("전체 읽음 처리 실패:", error);
      alert("전체 읽음 처리에 실패했습니다.");
    }
  };

  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-neutral-200 bg-white shadow-lg">
      {/* 한글 설명: 헤더 */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
        <h3 className="text-sm font-semibold text-neutral-900">알림</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              전체 읽음
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-neutral-500 hover:text-neutral-700"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 한글 설명: 알림 목록 */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="py-8 text-center text-sm text-neutral-500">
            로딩 중...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-neutral-500">
            알림이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => handleNotificationClick(notification)}
                className={`w-full px-4 py-3 text-left transition hover:bg-neutral-50 ${
                  !notification.read ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 한글 설명: 읽지 않은 알림 표시 점 */}
                  {!notification.read && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        !notification.read
                          ? "text-neutral-900"
                          : "text-neutral-600"
                      }`}
                    >
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 한글 설명: 푸터 (전체 보기 링크) */}
      {notifications.length > 0 && (
        <div className="border-t border-neutral-200 px-4 py-2">
          <button
            type="button"
            onClick={() => {
              navigate("/notifications");
              onClose();
            }}
            className="w-full text-center text-xs text-blue-600 hover:text-blue-700"
          >
            전체 보기
          </button>
        </div>
      )}
    </div>
  );
};

