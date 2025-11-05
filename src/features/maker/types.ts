// 한글 설명: 메이커 관련 도메인 타입 정의. DB 스키마에 맞춘 DTO/타입 선언

export type MakerId = string;
export type UserId = string;

export interface MakerDTO {
  id: MakerId;
  ownerUserId: UserId; // users.id, 1유저 1메이커
  name: string; // 기본 생성 시 users.email을 기본값으로 사용 후 수정 가능
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


