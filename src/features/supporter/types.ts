// 한글 설명: 서포터 관련 도메인 타입 정의. DB 스키마에 맞춘 DTO/타입 선언

export type UserId = string;

export interface SupporterProfileDTO {
  userId: UserId; // supporter_profiles.user_id, users.id 참조
  displayName: string | null;
  bio: string | null;
  imageUrl: string | null;
  phone: string | null;
  address: string | null;
  postalCode: string | null;
  interests: Array<number>; // interests.id 목록
  createdAt?: string;
  updatedAt?: string;
}

export interface InterestDTO {
  id: number;
  name: string;
  createdAt?: string;
}


