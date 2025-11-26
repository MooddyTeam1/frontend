// 한글 설명: 트래킹 이벤트 타입 정의 (백엔드 TrackingEventType과 일치)
export type TrackingEventType =
  | "PROJECT_VIEW" // 프로젝트 상세 페이지 조회
  | "PROJECT_CARD_IMPRESSION" // 프로젝트 카드 노출
  | "PROJECT_CARD_CLICK" // 프로젝트 카드 클릭
  | "PROJECT_BOOKMARK" // 프로젝트 찜하기
  | "PROJECT_UNBOOKMARK" // 프로젝트 찜 해제
  | "PROJECT_SHARE" // 프로젝트 공유
  | "PROJECT_PLEDGE_BUTTON_CLICK"; // 후원하기 버튼 클릭

// 한글 설명: 트래킹 이벤트 요청 DTO
export interface TrackingEventRequest {
  eventType: TrackingEventType;
  projectId?: number; // 프로젝트 ID (이벤트 타입에 따라 필수/선택)
  sessionId?: string; // 세션 ID (선택, 없으면 서버에서 생성)
  metadata?: Record<string, unknown>; // 추가 메타데이터 (선택)
}

// 한글 설명: 트래킹 이벤트 응답 DTO
export interface TrackingEventResponse {
  eventId: string;
  eventType: TrackingEventType;
  projectId?: number;
  sessionId: string;
  timestamp: string;
}

