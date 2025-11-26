// 한글 설명: SSE(Server-Sent Events)를 사용한 실시간 알림 구독 훅
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../auth/stores/authStore";
import { useNotificationStore } from "../stores/notificationStore";
import { API_BASE_URL } from "../../../services/api";
import type { NotificationResponse } from "../types";

/**
 * 한글 설명: SSE를 사용하여 실시간 알림을 구독하는 훅
 * - 로그인한 사용자만 구독 가능
 * - 연결이 끊어지면 자동으로 재연결 시도
 * - 알림 수신 시 전역 상태에 자동 반영
 */
export const useSseNotification = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification, incrementUnreadCount } = useNotificationStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // 한글 설명: 로그인하지 않은 경우 구독하지 않음
    if (!isAuthenticated || !user) {
      return;
    }

    // 한글 설명: 토큰 가져오기
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("[useSseNotification] 토큰이 없어 SSE 구독을 시작할 수 없습니다.");
      return;
    }

    // 한글 설명: SSE 연결 URL 생성
    // 백엔드: GET /notifications/subscribe?token={token}
    const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${encodeURIComponent(token)}`;

    console.log("[useSseNotification] SSE 구독 시작:", sseUrl);

    // 한글 설명: EventSource 생성
    const eventSource = new EventSource(sseUrl);
    eventSourceRef.current = eventSource;

    // 한글 설명: 연결 성공 이벤트
    eventSource.addEventListener("connect", (event) => {
      console.log("[useSseNotification] SSE 연결 성공:", event.data);
    });

    // 한글 설명: 알림 수신 이벤트
    eventSource.addEventListener("notification", (event) => {
      try {
        const notification: NotificationResponse = JSON.parse(event.data);
        console.log("[useSseNotification] 알림 수신:", notification);
        
        // 한글 설명: 전역 상태에 알림 추가
        addNotification(notification);
        
        // 한글 설명: 읽지 않은 알림 개수 증가
        if (!notification.read) {
          incrementUnreadCount();
        }
      } catch (error) {
        console.error("[useSseNotification] 알림 파싱 실패:", error, event.data);
      }
    });

    // 한글 설명: 에러 처리
    eventSource.onerror = (error) => {
      console.error("[useSseNotification] SSE 에러:", error);
      // 한글 설명: 연결이 끊어지면 3초 후 재연결 시도
      eventSource.close();
      setTimeout(() => {
        if (isAuthenticated && user) {
          // 한글 설명: 재연결은 useEffect가 다시 실행되면서 자동으로 처리됨
          console.log("[useSseNotification] 재연결 시도...");
        }
      }, 3000);
    };

    // 한글 설명: 컴포넌트 언마운트 시 연결 종료
    return () => {
      console.log("[useSseNotification] SSE 구독 종료");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isAuthenticated, user, addNotification, incrementUnreadCount]);
};

