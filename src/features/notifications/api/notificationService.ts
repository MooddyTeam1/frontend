// 한글 설명: 알림 API 서비스 함수 모음
import api from "../../../services/api";
import type { NotificationResponse } from "../types";

/**
 * 한글 설명: 알림 목록 전체 조회 (최신순)
 * GET /notifications
 */
export const getNotifications = async (): Promise<NotificationResponse[]> => {
  const { data } = await api.get<NotificationResponse[]>("/notifications");
  return data;
};

/**
 * 한글 설명: 읽지 않은 알림 개수 조회
 * GET /notifications/unread-count
 */
export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get<number>("/notifications/unread-count");
  return data;
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

