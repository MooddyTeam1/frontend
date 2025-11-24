// 한글 설명: 메이커 관련 도메인 타입 정의. DB 스키마에 맞춘 DTO/타입 선언

export type MakerId = string;
export type UserId = string;

// 한글 설명: 메이커 유형 (개인/사업자)
export type MakerType = "INDIVIDUAL" | "BUSINESS";

export interface MakerDTO {
  id: MakerId;
  ownerUserId: UserId; // users.id, 1유저 1메이커
  makerType: MakerType; // 한글 설명: 개인 또는 사업자
  name: string; // 기본 생성 시 users.email을 기본값으로 사용 후 수정 가능
  businessNumber?: string | null; // 사업자등록번호 (사업자일 때 필수)
  businessName?: string | null; // 사업자 상호명 (사업자일 때)
  businessType?: string | null; // 업태 (사업자일 때)
  onlineSalesReportNumber?: string | null; // 통신판매업 신고번호 (사업자일 때)
  establishedAt: string | null; // yyyy-mm-dd
  industryType: string | null;
  representative: string | null;
  location: string | null;
  productIntro: string | null;
  coreCompetencies: string | null;
  imageUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  techStack: string[]; // tech_stack_json 파싱 결과
  keywords: number[]; // maker_keywords.id 목록
  createdAt?: string;
  updatedAt?: string;
}

export interface MakerKeywordDTO {
  id: number;
  name: string;
  createdAt?: string;
}


