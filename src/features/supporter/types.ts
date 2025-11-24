// 한글 설명: 서포터 관련 도메인 타입 정의. DB 스키마에 맞춘 DTO/타입 선언

export type UserId = string;

import type { ProjectCardResponseDTO } from "../projects/types";

export interface SupporterProfileDTO {
  userId: UserId; // supporter_profiles.user_id, users.id 참조
  displayName: string | null;
  bio: string | null;
  imageUrl: string | null;
  interests: string[]; // 관심사 이름 목록
  phone: string | null;
  address1: string | null;
  address2: string | null;
  postalCode: string | null;
  createdAt?: string;
  updatedAt?: string;
  // 한글 설명: 내가 찜한 프로젝트 목록 (카드형 리스트에 사용할 데이터)
  bookmarkedProjects?: ProjectCardResponseDTO[];
}

export interface InterestDTO {
  id: string;
  name: string;
  createdAt?: string;
}


