// 한글 설명: 알림 API 서비스 함수 모음
import api from "../../../services/api";
import type { NotificationResponse } from "../types";

/**
 * 한글 설명: 알림 목록 전체 조회 (최신순)
 * GET /notifications
 */
export const getNotifications = async (): Promise<NotificationResponse[]> => {
  console.log("[notificationService] GET /notifications 요청");
  const { data } = await api.get<NotificationResponse[]>("/notifications");
  console.log("[notificationService] GET /notifications 응답:", {
    totalCount: data.length,
    unreadCount: data.filter((n) => !n.read).length,
    readCount: data.filter((n) => n.read).length,
  });
  return data;
};

/**
 * 한글 설명: 읽지 않은 알림 개수 조회
 * GET /notifications/unread-count
 */
export const getUnreadCount = async (): Promise<number> => {
  console.log("[notificationService] GET /notifications/unread-count 요청");
  const { data } = await api.get<number>("/notifications/unread-count");
  console.log("[notificationService] GET /notifications/unread-count 응답:", {
    rawData: data,
    type: typeof data,
    parsed: typeof data === "string" ? parseInt(data, 10) : data,
  });
  
  // 한글 설명: 백엔드가 문자열로 보낼 수 있으므로 숫자로 변환
  const count = typeof data === "string" ? parseInt(data, 10) : data;
  if (isNaN(count)) {
    console.warn("[notificationService] 읽지 않은 알림 개수가 유효한 숫자가 아닙니다:", data);
    return 0;
  }
  return count;
};

/**
 * 한글 설명: 알림 전체 읽음 처리
 * PATCH /notifications/read/all
 */
export const markAllAsRead = async (): Promise<void> => {
  await api.patch("/notifications/read/all");
};

/**
 * 한글 설명: 알림 단건 읽음 처리
 * PATCH /notifications/read/{id}
 */
export const markAsRead = async (notificationId: number): Promise<void> => {
  await api.patch(`/notifications/read/${notificationId}`);
};

