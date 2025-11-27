// 한글 설명: 트래킹 이벤트를 쉽게 사용할 수 있는 커스텀 훅
import { useCallback } from "react";
import { trackEvent } from "../api/trackingService";
import type { TrackingEventRequest, TrackingEventType } from "../types";

/**
 * 한글 설명: 트래킹 이벤트를 전송하는 커스텀 훅
 * @returns 트래킹 이벤트 전송 함수
 */
export function useTracking() {
  /**
   * 한글 설명: 트래킹 이벤트를 전송한다.
   * @param eventType - 이벤트 타입
   * @param projectId - 프로젝트 ID (선택)
   * @param metadata - 추가 메타데이터 (선택)
   */
  const track = useCallback(
    (
      eventType: TrackingEventType,
      projectId?: number,
      metadata?: Record<string, unknown>
    ) => {
      const event: TrackingEventRequest = {
        eventType,
        projectId,
        metadata,
      };

      // 한글 설명: 비동기로 전송하되 await하지 않음 (논블로킹)
      void trackEvent(event);
    },
    []
  );

  return { track };
}

