// 한글 설명: 트래킹 이벤트 API 서비스. 백엔드에 사용자 행동 이벤트를 전송한다.
import api from "../../../services/api";
import type {
  TrackingEventRequest,
  TrackingEventResponse,
} from "../types";
import { getSessionId } from "../../../shared/utils/sessionManager";

/**
 * 한글 설명: 트래킹 이벤트를 백엔드에 전송한다.
 * @param event - 트래킹 이벤트 요청 데이터
 * @returns 트래킹 이벤트 응답 데이터
 */
export async function trackEvent(
  event: TrackingEventRequest
): Promise<TrackingEventResponse> {
  // 한글 설명: 세션 ID가 없으면 자동으로 가져온다
  const sessionId = event.sessionId || getSessionId();

  const payload: TrackingEventRequest = {
    ...event,
    sessionId,
  };

  try {
    const { data } = await api.post<TrackingEventResponse>(
      "/tracking/events",
      payload
    );
    return data;
  } catch (error) {
    // 한글 설명: 트래킹 실패는 앱 동작에 영향을 주지 않도록 에러를 로그만 남기고 무시
    console.warn("[trackingService] 트래킹 이벤트 전송 실패:", error);
    // 한글 설명: 실패해도 기본 응답을 반환하여 호출자가 에러를 처리하지 않아도 되도록 함
    return {
      eventId: "",
      eventType: event.eventType,
      projectId: event.projectId,
      sessionId,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * 한글 설명: 여러 트래킹 이벤트를 한 번에 전송한다. (배치 처리)
 * @param events - 트래킹 이벤트 배열
 * @returns 트래킹 이벤트 응답 배열
 */
export async function trackEvents(
  events: TrackingEventRequest[]
): Promise<TrackingEventResponse[]> {
  // 한글 설명: 각 이벤트에 세션 ID를 자동으로 추가
  const sessionId = getSessionId();
  const payloads = events.map((event) => ({
    ...event,
    sessionId: event.sessionId || sessionId,
  }));

  try {
    const { data } = await api.post<TrackingEventResponse[]>(
      "/tracking/events/batch",
      payloads
    );
    return data;
  } catch (error) {
    console.warn("[trackingService] 배치 트래킹 이벤트 전송 실패:", error);
    // 한글 설명: 실패해도 기본 응답 배열을 반환
    return payloads.map((payload) => ({
      eventId: "",
      eventType: payload.eventType,
      projectId: payload.projectId,
      sessionId: payload.sessionId || sessionId,
      timestamp: new Date().toISOString(),
    }));
  }
}

