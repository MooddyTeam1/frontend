// 한글 설명: Q&A 관련 타입 정의

/**
 * 한글 설명: 프로젝트 Q&A 응답 DTO (백엔드 ProjectQnaResponse와 매핑)
 */
export interface ProjectQnaResponse {
  id: number; // 한글 설명: Q&A ID
  questionerName: string; // 한글 설명: 질문자 이름/닉네임 (서포터 닉네임 기준, 없으면 유저 이름)
  questionerId: number; // 한글 설명: 질문자 userId
  question: string; // 한글 설명: 질문 내용
  answer: string | null; // 한글 설명: 답변 내용 (없을 수 있음)
  status: "PENDING" | "ANSWERED"; // 한글 설명: 상태
  createdAt: string; // 한글 설명: 질문일시 (ISO 문자열)
  answeredAt: string | null; // 한글 설명: 답변일시 (없을 수 있음)
}

/**
 * 한글 설명: Q&A 질문 작성 요청 DTO
 */
export interface ProjectQnaCreateRequest {
  question: string; // 한글 설명: 질문 내용
  isPrivate?: boolean; // 한글 설명: 비공개 여부 (true면 나 + 메이커만 볼 수 있음, 기본값 true)
}

/**
 * 한글 설명: Q&A 답변 등록/수정 요청 DTO
 */
export interface ProjectQnaAnswerRequest {
  answer: string; // 한글 설명: 메이커가 작성하는 답변 내용
}

