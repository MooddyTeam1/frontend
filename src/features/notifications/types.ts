// 한글 설명: 알림 관련 타입 정의

/**
 * 한글 설명: 알림 타입 (백엔드 NotificationType enum 대응)
 */
export type NotificationType = "SUPPORTER" | "MAKER" | "ADMIN";

/**
 * 한글 설명: 알림 대상 타입 (백엔드 NotificationTargetType enum 대응)
 * 상세 페이지로 이동하기 위한 타입 구분
 */
export type NotificationTargetType =
  | "PROJECT"
  | "NEWS"
  | "ORDER"
  | "SETTLEMENT"
  | "MAKER";

/**
 * 한글 설명: 알림 응답 DTO (백엔드 NotificationResponse 대응)
 */
export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  targetId: number; // 한글 설명: 상세 페이지로 이동하기 위한 Target ID
  targetType: NotificationTargetType; // 한글 설명: 알림 대상 타입 (페이지 이동 구분)
  read: boolean;
  createdAt: string; // 한글 설명: ISO 8601 형식 (예: "2025-11-25T12:00:00")
}

