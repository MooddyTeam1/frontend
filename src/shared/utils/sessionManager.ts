// 한글 설명: 세션 관리 유틸리티. 로컬스토리지에 세션 토큰을 저장하고 관리한다.

const SESSION_STORAGE_KEY = "moa_session_id";
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30분

// 한글 설명: 세션 정보 타입
interface SessionInfo {
  sessionId: string;
  createdAt: number; // 타임스탬프 (밀리초)
}

/**
 * 한글 설명: 세션 ID를 생성한다. UUID v4 형식을 사용한다.
 */
function generateSessionId(): string {
  // 한글 설명: 간단한 UUID v4 생성 (브라우저 호환성 고려)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 한글 설명: 현재 세션 ID를 가져온다. 없거나 만료되었으면 새로 생성한다.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") {
    // 한글 설명: 서버 사이드 렌더링 환경에서는 빈 문자열 반환
    return "";
  }

  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) {
      // 한글 설명: 저장된 세션이 없으면 새로 생성
      return createNewSession();
    }

    const sessionInfo: SessionInfo = JSON.parse(stored);
    const now = Date.now();
    const age = now - sessionInfo.createdAt;

    if (age > SESSION_DURATION_MS) {
      // 한글 설명: 세션이 만료되었으면 새로 생성
      return createNewSession();
    }

    return sessionInfo.sessionId;
  } catch (error) {
    console.warn("[sessionManager] 세션 정보 파싱 실패, 새 세션 생성:", error);
    return createNewSession();
  }
}

/**
 * 한글 설명: 새로운 세션을 생성하고 로컬스토리지에 저장한다.
 */
function createNewSession(): string {
  const sessionId = generateSessionId();
  const sessionInfo: SessionInfo = {
    sessionId,
    createdAt: Date.now(),
  };

  try {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(sessionInfo)
    );
  } catch (error) {
    console.warn("[sessionManager] 세션 저장 실패:", error);
  }

  return sessionId;
}

/**
 * 한글 설명: 세션을 갱신한다. (세션 만료 시간을 연장)
 */
export function refreshSession(): void {
  if (typeof window === "undefined") return;

  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const sessionInfo: SessionInfo = JSON.parse(stored);
      sessionInfo.createdAt = Date.now();
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify(sessionInfo)
      );
    }
  } catch (error) {
    console.warn("[sessionManager] 세션 갱신 실패:", error);
  }
}

/**
 * 한글 설명: 세션을 초기화한다. (로그아웃 시 사용)
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (error) {
    console.warn("[sessionManager] 세션 삭제 실패:", error);
  }
}

