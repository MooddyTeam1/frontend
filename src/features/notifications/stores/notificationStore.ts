// 한글 설명: 알림 전역 상태 관리 (Zustand)
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { NotificationResponse } from "../types";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../api/notificationService";

type NotificationStore = {
  // 한글 설명: 알림 목록
  notifications: NotificationResponse[];
  // 한글 설명: 읽지 않은 알림 개수
  unreadCount: number;
  // 한글 설명: 로딩 상태
  loading: boolean;
  // 한글 설명: 에러 상태
  error: string | null;

  // 한글 설명: Actions
  // 알림 목록 불러오기
  fetchNotifications: () => Promise<void>;
  // 읽지 않은 알림 개수 불러오기
  fetchUnreadCount: () => Promise<void>;
  // 알림 추가 (SSE로 수신한 알림)
  addNotification: (notification: NotificationResponse) => void;
  // 읽지 않은 알림 개수 증가
  incrementUnreadCount: () => void;
  // 읽지 않은 알림 개수 감소
  decrementUnreadCount: () => void;
  // 알림 전체 읽음 처리
  markAllAsRead: () => Promise<void>;
  // 알림 단건 읽음 처리
  markAsRead: (notificationId: number) => Promise<void>;
  // 상태 초기화
  reset: () => void;
};

/**
 * 한글 설명: 알림 상태를 관리하는 Zustand store
 */
export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,

      // 한글 설명: 알림 목록 불러오기
      fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
          const notifications = await getNotifications();
          set({ notifications, loading: false });
        } catch (error) {
          console.error("알림 목록 조회 실패:", error);
          set({
            error: "알림 목록을 불러오는 도중 문제가 발생했습니다.",
            loading: false,
          });
        }
      },

      // 한글 설명: 읽지 않은 알림 개수 불러오기
      fetchUnreadCount: async () => {
        try {
          const count = await getUnreadCount();
          console.log("[NotificationStore] 읽지 않은 알림 개수 조회:", count);
          set({ unreadCount: count });
        } catch (error) {
          console.error("읽지 않은 알림 개수 조회 실패:", error);
        }
      },

      // 한글 설명: 알림 추가 (SSE로 수신한 알림)
      addNotification: (notification: NotificationResponse) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
        }));
      },

      // 한글 설명: 읽지 않은 알림 개수 증가
      incrementUnreadCount: () => {
        set((state) => ({
          unreadCount: state.unreadCount + 1,
        }));
      },

      // 한글 설명: 읽지 않은 알림 개수 감소
      decrementUnreadCount: () => {
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      // 한글 설명: 알림 전체 읽음 처리
      markAllAsRead: async () => {
        try {
          await markAllAsRead();
          // 한글 설명: 로컬 상태 즉시 업데이트 (낙관적 업데이트)
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
            unreadCount: 0,
          }));
          // 한글 설명: 백엔드에서 최신 카운트 가져와서 동기화 (중요: 백엔드 실제 값 반영)
          // 한글 설명: get()을 사용하여 store의 다른 함수에 접근
          const state = get();
          await state.fetchUnreadCount();
        } catch (error) {
          console.error("알림 전체 읽음 처리 실패:", error);
          throw error;
        }
      },

      // 한글 설명: 알림 단건 읽음 처리
      markAsRead: async (notificationId: number) => {
        try {
          await markAsRead(notificationId);
          // 한글 설명: 로컬 상태 즉시 업데이트 (낙관적 업데이트)
          set((state) => {
            const updatedNotifications = state.notifications.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            );
            const wasUnread = state.notifications.find(
              (n) => n.id === notificationId && !n.read
            );
            return {
              notifications: updatedNotifications,
              unreadCount: wasUnread
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
            };
          });
          // 한글 설명: 백엔드에서 최신 카운트 가져와서 동기화 (중요: 백엔드 실제 값 반영)
          // 한글 설명: get()을 사용하여 store의 다른 함수에 접근
          const state = get();
          await state.fetchUnreadCount();
        } catch (error) {
          console.error("알림 읽음 처리 실패:", error);
          throw error;
        }
      },

      // 한글 설명: 상태 초기화
      reset: () => {
        set({
          notifications: [],
          unreadCount: 0,
          loading: false,
          error: null,
        });
      },
    }),
    { name: "NotificationStore" }
  )
);

